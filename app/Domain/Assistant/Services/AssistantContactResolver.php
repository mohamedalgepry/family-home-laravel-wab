<?php

namespace App\Domain\Assistant\Services;

use App\Domain\Listings\Services\SettingsService;
use App\Domain\Users\Models\User;

class AssistantContactResolver
{
    /**
     * In-memory cache for agent details during a single request lifecycle.
     *
     * @var array<int, array|null>
     */
    private static array $agentCache = [];

    /**
     * Clear the in-memory cache (useful for testing).
     */
    public static function clearCache(): void
    {
        self::$agentCache = [];
    }

    /**
     * Resolve the public contact details of an agent/broker by user_id.
     * Uses the default connection to bypass read-only DB restrictions.
     */
    public static function resolveAgentContact(?int $userId): ?array
    {
        if (empty($userId)) {
            return null;
        }

        if (array_key_exists($userId, self::$agentCache)) {
            return self::$agentCache[$userId];
        }

        try {
            $defaultConn = config('database.default', 'mysql');
            $user = User::on($defaultConn)
                ->select(['id', 'name', 'role', 'email'])
                ->with(['profile' => function ($query) {
                    $query->select(['id', 'user_id', 'phone', 'whatsapp', 'facebook', 'linkedin']);
                }])
                ->find($userId);

            if (!$user) {
                return self::$agentCache[$userId] = null;
            }

            $profile = $user->profile;

            $contact = [
                'id' => (int) $user->id,
                'name' => htmlspecialchars((string) $user->name, ENT_QUOTES, 'UTF-8'),
                'role' => (string) $user->role,
                'email' => filter_var($user->email, FILTER_VALIDATE_EMAIL) ? $user->email : null,
                'phone' => !empty($profile?->phone) ? trim((string) $profile->phone) : null,
                'whatsapp' => !empty($profile?->whatsapp) ? trim((string) $profile->whatsapp) : null,
                'facebook' => !empty($profile?->facebook) ? trim((string) $profile->facebook) : null,
                'linkedin' => !empty($profile?->linkedin) ? trim((string) $profile->linkedin) : null,
            ];

            return self::$agentCache[$userId] = $contact;
        } catch (\Throwable $e) {
            return self::$agentCache[$userId] = null;
        }
    }

    /**
     * Get all official company contact information.
     */
    public static function getCompanyContact(): array
    {
        $settingsService = null;
        try {
            $settingsService = app(SettingsService::class);
        } catch (\Throwable $e) {
            // Service not registered or container unavailable
        }

        $phone = $settingsService?->get('company_phone') ?: (string) env('COMPANY_PHONE', '');
        $whatsapp = $settingsService?->get('company_whatsapp') ?: (string) (config('assistant.default_whatsapp') ?: env('COMPANY_WHATSAPP', '201000000000'));
        $email = $settingsService?->get('company_email') ?: (string) (config('mail.from.address') ?: env('MAIL_FROM_ADDRESS', 'info@familyhome-co.com'));
        $address = $settingsService?->get('company_address') ?: (string) env('COMPANY_ADDRESS', '');
        $facebook = $settingsService?->get('social_facebook') ?: '';
        $instagram = $settingsService?->get('social_instagram') ?: '';
        $linkedin = $settingsService?->get('social_linkedin') ?: '';
        $twitter = $settingsService?->get('social_twitter') ?: '';

        // Clean WhatsApp digits
        $cleanWa = preg_replace('/[^\d]/', '', (string) $whatsapp);
        $waUrl = !empty($cleanWa) ? "https://wa.me/{$cleanWa}" : null;

        return [
            'phone' => !empty($phone) ? trim($phone) : null,
            'whatsapp' => !empty($whatsapp) ? trim($whatsapp) : null,
            'whatsapp_url' => $waUrl,
            'email' => !empty($email) ? trim($email) : null,
            'address' => !empty($address) ? trim($address) : null,
            'facebook' => !empty($facebook) ? trim($facebook) : null,
            'instagram' => !empty($instagram) ? trim($instagram) : null,
            'linkedin' => !empty($linkedin) ? trim($linkedin) : null,
            'twitter' => !empty($twitter) ? trim($twitter) : null,
        ];
    }

    /**
     * Format company contact section for the LLM system prompt.
     */
    public static function formatCompanyPromptSection(string $locale = 'ar'): string
    {
        $contact = self::getCompanyContact();

        $lines = [];
        if ($locale === 'en') {
            if ($contact['phone']) $lines[] = "• Phone: {$contact['phone']}";
            if ($contact['whatsapp_url']) $lines[] = "• WhatsApp: {$contact['whatsapp_url']} (Direct: {$contact['whatsapp']})";
            if ($contact['email']) $lines[] = "• Email: {$contact['email']}";
            if ($contact['address']) $lines[] = "• Address: {$contact['address']}";
            if ($contact['facebook']) $lines[] = "• Facebook: {$contact['facebook']}";
            if ($contact['instagram']) $lines[] = "• Instagram: {$contact['instagram']}";
            if ($contact['linkedin']) $lines[] = "• LinkedIn: {$contact['linkedin']}";

            if (empty($lines)) {
                return '';
            }

            return "\n\n# OFFICIAL FAMILY HOME CONTACT INFORMATION (VERIFIED — USE THESE DIRECTLY):\n"
                . implode("\n", $lines)
                . "\n\n# CONTACT & AGENT RULES (STRICT):\n"
                . "1. Whenever a user asks for contact info, booking a viewing, or inquiring with customer service, provide these verified contact details.\n"
                . "2. Units and projects contain the assigned agent/broker info (agent_name, agent_phone, agent_whatsapp). When discussing a specific property, provide the assigned agent's contact details.\n"
                . "3. If a unit/project does not have a direct agent phone number, provide the official Family Home phone/WhatsApp above and inform the customer that the team will connect them directly with the property manager.\n"
                . "4. CRITICAL: NEVER hallucinate or invent fake phone numbers, emails, or names under any circumstances.\n";
        }

        if ($contact['phone']) $lines[] = "• رقم الهاتف: {$contact['phone']}";
        if ($contact['whatsapp_url']) $lines[] = "• واتساب المبيعات والدعم: {$contact['whatsapp_url']} ({$contact['whatsapp']})";
        if ($contact['email']) $lines[] = "• البريد الإلكتروني الرسمي: {$contact['email']}";
        if ($contact['address']) $lines[] = "• عنوان المقر الرئيسي: {$contact['address']}";
        if ($contact['facebook']) $lines[] = "• صفحة فيسبوك: {$contact['facebook']}";
        if ($contact['instagram']) $lines[] = "• حساب إنستغرام: {$contact['instagram']}";
        if ($contact['linkedin']) $lines[] = "• حساب لينكدإن: {$contact['linkedin']}";

        if (empty($lines)) {
            return '';
        }

        return "\n\n# بيانات التواصل الرسمية لشركة «فاميلي هوم» (معتمدة وحقيقية — استخدمها كما هي):\n"
            . implode("\n", $lines)
            . "\n\n# قواعد صارمة لبيانات التواصل والوكلاء العقاريين:\n"
            . "1. بيانات تواصل الشركة/الموقع: عند طلب العميل التواصل مع الشركة أو الاستفسار أو حجز موعد، قدّم له بيانات التواصل الرسمية المذكورة أعلاه.\n"
            . "2. الوكيل العقاري المسؤول: كل وحدة أو مشروع يحتوي على بيانات الوكيل العقاري المرفوع باسمه (agent_name، agent_phone، agent_whatsapp). إذا سأل العميل عن الوكيل أو كيفية التواصل بشأن وحدة معينة، قدّم له اسم الوكيل ورقم هاتفه ورابط الواتساب الخاص به بدقة.\n"
            . "3. في حال عدم توفر رقم هاتف مباشر للوكيل، وضّح للعميل فوراً: «يمكنك التواصل مع فريق مبيعات فاميلي هوم على [رقم الهاتف] أو عبر الواتساب، وسيقوم فريقنا بربطك مباشرة بالمستشار العقاري المسؤول عن هذه الوحدة».\n"
            . "4. تحذير حاسم: ممنوع منعاً باتاً اختراع أو توليد أي أرقام هواتف أو إيميلات أو بيانات تواصل وهمية أو غير مطابقة للبيانات المتاحة.\n";
    }
}
