<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\SettingsService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UnitExpiryNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Unit $unit,
        public string $type = 'warning',
        public ?int $daysRemaining = null,
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $unitName = $this->unit->name_ar ?: $this->unit->name;
        $isWarning = $this->type === 'warning';
        $recipientName = $notifiable->name ?? 'مدير النظام';

        $subject = $isWarning
            ? "تنبيه: الوحدة \"{$unitName}\" على وشك الانتهاء"
            : "انتهت صلاحية الوحدة: {$unitName}";

        $settingsService = app(SettingsService::class);
        $siteLogo = $settingsService->get('site_logo');
        $logoUrl = $siteLogo ? asset('storage/'.$siteLogo) : asset('icon.png');

        return (new MailMessage)
            ->subject($subject)
            ->greeting("مرحباً {$recipientName}")
            ->line($isWarning
                ? "الوحدة \"{$unitName}\" على وشك الانتهاء خلال {$this->daysRemaining} أيام."
                : "انتهت صلاحية الوحدة \"{$unitName}\". تم إخفاؤها عن الزوار.")
            ->action('إدارة الوحدات', url('/admin/units'))
            ->line('يرجى اتخاذ الإجراء المناسب.');
    }

    public function toArray($notifiable): array
    {
        $unitName = $this->unit->name_ar ?: $this->unit->name;
        $isWarning = $this->type === 'warning';

        return [
            'type' => $isWarning ? 'unit_expiry_warning' : 'unit_expired',
            'title' => $isWarning ? 'تنبيه قرب انتهاء صلاحية وحدة' : 'انتهت صلاحية وحدة',
            'title_en' => $isWarning ? 'Unit Expiry Warning' : 'Unit Expired',
            'unit_id' => $this->unit->id,
            'unit_name' => $unitName,
            'unit_slug' => $this->unit->slug,
            'project_id' => $this->unit->project_id,
            'expires_at' => $this->unit->auto_delete_at?->toIso8601String(),
            'days_remaining' => $this->daysRemaining,
            'message' => $isWarning
                ? "الوحدة \"{$unitName}\" على وشك الانتهاء خلال {$this->daysRemaining} أيام. يمكنك تمديد المدة أو حذف الإعلان."
                : "انتهت صلاحية الوحدة \"{$unitName}\". تم إخفاؤها عن الزوار.",
        ];
    }
}

