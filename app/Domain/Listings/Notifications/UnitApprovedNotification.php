<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class UnitApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 60];

    public int $timeout = 30;

    public function __construct(
        public Unit $unit,
        public User $approver
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $approverName = $this->approver->name;
        $unitName = $this->unit->name_ar ?: $this->unit->name;

        return [
            'type' => 'unit_approved',
            'title' => 'تم الموافقة على الوحدة',
            'title_en' => 'Unit Approved',
            'unit_id' => $this->unit->id,
            'unit_name' => $unitName,
            'unit_slug' => $this->unit->slug,
            'approver_id' => $this->approver->id,
            'approver_name' => $approverName,
            'approver_role' => $this->approver->role,
            'message' => "تمت الموافقة على وحدتك \"{$unitName}\" بواسطة {$approverName}. أصبحت الآن منشورة في الموقع.",
        ];
    }
}
