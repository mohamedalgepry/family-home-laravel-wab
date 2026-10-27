<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class UnitPendingApprovalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 60];

    public int $timeout = 30;

    public function __construct(
        public Unit $unit,
        public User $creator
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $creatorName = $this->creator->name;
        $unitName = $this->unit->name_ar ?: $this->unit->name;

        return [
            'type' => 'unit_pending_approval',
            'title' => 'وحدة جديدة بانتظار الموافقة',
            'title_en' => 'New Unit Pending Approval',
            'unit_id' => $this->unit->id,
            'unit_name' => $unitName,
            'unit_slug' => $this->unit->slug,
            'creator_id' => $this->creator->id,
            'creator_name' => $creatorName,
            'creator_role' => $this->creator->role,
            'message' => "قام {$creatorName} بإضافة وحدة جديدة: \"{$unitName}\". يرجى مراجعتها وتفعيلها.",
        ];
    }
}
