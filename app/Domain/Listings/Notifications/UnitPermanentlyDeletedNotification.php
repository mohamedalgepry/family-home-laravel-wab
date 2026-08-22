<?php

namespace App\Domain\Listings\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class UnitPermanentlyDeletedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public int $unitId,
        public string $unitNameAr,
        public string $unitNameEn,
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $unitName = $this->unitNameAr ?: $this->unitNameEn;

        return [
            'type' => 'unit_permanently_deleted',
            'title' => 'تم حذف الوحدة نهائياً',
            'title_en' => 'Unit Permanently Deleted',
            'unit_id' => $this->unitId,
            'unit_name' => $unitName,
            'unit_name_ar' => $this->unitNameAr,
            'unit_name_en' => $this->unitNameEn,
            'message' => "تم حذف الوحدة «{$unitName}» نهائياً بعد انتهاء فترة السماح.",
            'message_en' => "Unit “{$this->unitNameEn}” was permanently deleted after the grace period expired.",
        ];
    }
}
