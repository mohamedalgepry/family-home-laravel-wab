<?php

namespace App\Http\Controllers\Public;

use App\Domain\Assistant\Models\AssistantLead;
use App\Domain\Assistant\Notifications\NewAssistantLeadNotification;
use App\Domain\Assistant\Services\AssistantOrchestratorService;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Log;

class AiAssistantController
{
    public function __construct(
        private readonly AssistantOrchestratorService $orchestrator,
    ) {}

    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:1', 'max:1000'],
            'history' => ['nullable', 'array', 'max:10'],
            'history.*.role' => ['required_with:history', 'string', 'in:user,assistant'],
            'history.*.content' => ['required_with:history', 'string', 'max:1000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
            'context_url' => ['nullable', 'string', 'max:500'],
            'context_title' => ['nullable', 'string', 'max:300'],
            'page_context' => ['nullable', 'array'],
        ]);

        $message = trim((string) $validated['message']);
        $history = $validated['history'] ?? [];
        $locale = $validated['locale'] ?? app()->getLocale() ?: 'ar';

        $pageContext = is_array($validated['page_context'] ?? null) ? $validated['page_context'] : [];
        if (! empty($validated['context_url'])) {
            $pageContext['url'] = (string) $validated['context_url'];
        }
        if (! empty($validated['context_title'])) {
            $pageContext['title'] = (string) $validated['context_title'];
        }

        // Detect and record lead when phone number is provided
        $this->detectAndRecordLead($message, $history, $pageContext);

        try {
            $result = $this->orchestrator->chat(
                message: $message,
                history: $history,
                locale: $locale,
                pageContext: $pageContext
            );

            return response()->json([
                'success' => true,
                'reply' => $result['reply'],
                'recommended_units' => $result['recommended_units'] ?? [],
                'quick_replies' => $result['quick_replies'] ?? [],
                'is_fallback' => $result['is_fallback'] ?? false,
            ]);
        } catch (\Throwable $e) {
            // Fail-closed: log structured telemetry without user message or sensitive PII
            Log::warning('AiAssistantController caught unhandled exception, falling back safely', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => true,
                'is_fallback' => true,
                'reply' => $locale === 'en'
                    ? 'Hello! I am Hossam from Family Home. Would you like to explore our active projects or check available units?'
                    : 'أهلاً بك! أنا «حسام» من فاميلي هوم. تحب أساعدك في استعراض أحدث المشاريع العقارية أو الوحدات المتاحة للبيع والإيجار؟',
                'recommended_units' => [],
                'quick_replies' => $locale === 'en'
                    ? ['Show available projects', 'Apartments for sale', 'Contact our team']
                    : ['استعراض المشاريع المتاحة', 'شقق للبيع بالتقسيط', 'تواصل مع فريق المبيعات'],
            ], 200);
        }
    }

    /**
     * Detect phone number in user message, save or update AssistantLead, and notify administrators.
     */
    protected function detectAndRecordLead(string $message, array $history, array $pageContext): void
    {
        try {
            // Convert Eastern Arabic-Indic digits to ASCII standard digits
            $normalized = strtr($message, [
                '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
                '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
            ]);

            // Match Egyptian mobile formats or international standard (+201..., 00201..., 01...)
            if (! preg_match('/\b(?:\+?20|0020|0)?1[0125]\d{8}\b/', $normalized, $matches)) {
                return;
            }

            $rawPhone = $matches[0];
            $phone = preg_replace('/[^\d\+]/', '', $rawPhone);
            if (empty($phone)) {
                return;
            }

            // Determine context description
            $context = null;
            if (! empty($pageContext['unit_name'])) {
                $context = 'مهتم بوحدة: '.$pageContext['unit_name'];
            } elseif (! empty($pageContext['project_name'])) {
                $context = 'مهتم بمشروع: '.$pageContext['project_name'];
            } elseif (! empty($pageContext['title'])) {
                $context = $pageContext['title'];
            } elseif (! empty($pageContext['url'])) {
                $context = $pageContext['url'];
            }

            // Extract client name if introduced (e.g. "اسمي أحمد", "معك محمد")
            $clientName = null;
            if (preg_match('/(?:اسمي|معك|معاك|أنا|انا|name is)\s+([^\s,،\.\n]+(?:\s+[^\s,،\.\n]+)?)/iu', $message, $nameMatches)) {
                $stopWords = ['مهتم', 'عايز', 'بخصوص', 'رقمي', 'تليفوني', 'رقم', 'موبايلي', 'phone', 'interested', 'في', 'من'];

                // Drop trailing non-name words (including و-prefixed forms such as
                // "ورقمي" in "اسمي كريم ورقمي 010...") so only the real name remains.
                $words = preg_split('/\s+/u', trim($nameMatches[1])) ?: [];
                $nameWords = [];
                foreach ($words as $word) {
                    $normalized = mb_strtolower($word);
                    $withoutConjunction = preg_replace('/^و/u', '', $normalized);
                    if (in_array($normalized, $stopWords, true) || in_array($withoutConjunction, $stopWords, true)) {
                        break;
                    }
                    $nameWords[] = $word;
                }

                if ($nameWords !== []) {
                    $clientName = implode(' ', $nameWords);
                }
            }

            $fullHistory = $history;
            $fullHistory[] = ['role' => 'user', 'content' => $message];

            $leadScore = 7;
            if (! empty($pageContext['unit_id']) || ! empty($pageContext['project_id'])) {
                $leadScore += 2;
            }
            if (preg_match('/(شراء|حجز|معاينة|كاش|تقسيط|عاجل|urgent|buy|book)/iu', $message)) {
                $leadScore += 1;
            }
            $leadStatus = $leadScore >= 8 ? 'hot' : 'normal';

            $lead = AssistantLead::where('phone', $phone)->latest()->first();
            $shouldNotify = false;

            if (! $lead) {
                $lead = AssistantLead::create([
                    'name' => $clientName,
                    'phone' => $phone,
                    'context' => $context,
                    'status' => 'new',
                    'chat_history' => $fullHistory,
                    'lead_score' => $leadScore,
                    'lead_status' => $leadStatus,
                ]);
                $shouldNotify = true;
            } else {
                $lead->update([
                    'name' => $clientName ?: $lead->name,
                    'context' => $context ?: $lead->context,
                    'status' => 'new',
                    'chat_history' => $fullHistory,
                    'lead_score' => max((int) $lead->lead_score, $leadScore),
                    'lead_status' => $leadStatus === 'hot' ? 'hot' : $lead->lead_status,
                ]);

                // Avoid duplicate admin notification flood if notified recently (< 15 mins)
                $recentNotificationExists = DatabaseNotification::query()
                    ->where('type', NewAssistantLeadNotification::class)
                    ->where('data->lead_id', $lead->id)
                    ->where('created_at', '>=', now()->subMinutes(15))
                    ->exists();

                if (! $recentNotificationExists) {
                    $shouldNotify = true;
                }
            }

            if ($shouldNotify) {
                $admins = User::whereIn('role', ['admin', 'manager'])
                    ->where('is_active', true)
                    ->get();

                if ($admins->isNotEmpty()) {
                    $notification = new NewAssistantLeadNotification($lead);
                    $notificationService = app(NotificationService::class);

                    foreach ($admins as $admin) {
                        $admin->notify($notification);
                        $notificationService->clearUserCache($admin);
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::warning('AiAssistantController failed to record lead or dispatch notification: '.$e->getMessage());
        }
    }
}
