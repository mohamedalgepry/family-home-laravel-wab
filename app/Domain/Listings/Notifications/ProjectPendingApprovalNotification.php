<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ProjectPendingApprovalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 60];

    public int $timeout = 30;

    public function __construct(
        public Project $project,
        public int $minutesRemaining = 15
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'project_pending_approval',
            'title' => 'مشروع جديد بانتظار الموافقة',
            'title_en' => 'New Project Pending Approval',
            'project_id' => $this->project->id,
            'project_name' => $this->project->name_ar ?: $this->project->name,
            'project_slug' => $this->project->slug,
            'area_name' => $this->project->area?->name ?? 'غير محدد',
            'minutes_remaining' => $this->minutesRemaining,
            'deadline_at' => now()->addMinutes($this->minutesRemaining)->toIso8601String(),
            'message' => "تم إضافة مشروع \"{$this->project->name}\" ويحتاج لموافقة الأدمن ليكون نشطاً في الموقع.",
        ];
    }
}
