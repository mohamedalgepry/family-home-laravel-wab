<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Unit;
use Illuminate\Bus\Queueable;
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
        return ['database'];
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
