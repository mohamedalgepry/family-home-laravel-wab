<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Project;
use App\Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewProjectCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 60];

    public int $timeout = 30;

    public function __construct(
        public Project $project,
        public User $creator
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $creatorName = $this->creator->name;
        $projectName = $this->project->name_ar ?: $this->project->name;

        return [
            'type' => 'new_project_created',
            'title' => 'إضافة مشروع جديد',
            'title_en' => 'New Project Added',
            'project_id' => $this->project->id,
            'project_name' => $projectName,
            'project_slug' => $this->project->slug,
            'creator_id' => $this->creator->id,
            'creator_name' => $creatorName,
            'creator_role' => $this->creator->role,
            'area_name' => $this->project->area?->name ?? 'غير محدد',
            'message' => "قام {$creatorName} بإضافة مشروع جديد: \"{$projectName}\".",
        ];
    }
}
