<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Unit;
use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class UnitExtendedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Unit $unit,
        public int $days,
        public CarbonInterface $newExpiresAt,
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $unitNameAr = $this->unit->name_ar ?: $this->unit->name;
        $unitNameEn = $this->unit->name_en ?: $this->unit->name;
        $dateFormatted = $this->newExpiresAt->format('Y-m-d');

        return [
            'type' => 'unit_extended',
            'title' => 'تم تمديد مدة الوحدة',
            'title_en' => 'Unit Extended',
            'unit_id' => $this->unit->id,
            'unit_name' => $unitNameAr,
            'unit_name_ar' => $unitNameAr,
            'unit_name_en' => $unitNameEn,
            'days' => $this->days,
            'new_expires_at' => $this->newExpiresAt->toIso8601String(),
            'message' => "تم تمديد مدة الوحدة «{$unitNameAr}» بنجاح لمدة {$this->days} يوماً حتى تاريخ {$dateFormatted}.",
            'message_en' => "Unit “{$unitNameEn}” has been extended by {$this->days} days until {$dateFormatted}.",
        ];
    }
}
