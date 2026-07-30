<?php

namespace App\Domain\Listings\Notifications;

use App\Domain\Listings\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProjectExpiryWarningNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Project $project,
        public ?int $daysRemaining = null,
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $projectName = $this->project->name_ar ?: $this->project->name;

        return [
            'type' => 'project_expiry_warning',
            'title' => 'تنبيه قرب انتهاء مدة المشروع',
            'title_en' => 'Project Expiry Warning',
            'project_id' => $this->project->id,
            'project_name' => $projectName,
            'project_slug' => $this->project->slug,
            'area_name' => $this->project->area?->name ?? 'غير محدد',
            'days_remaining' => $this->daysRemaining,
            'expires_at' => $this->project->auto_delete_at?->toIso8601String(),
            'message' => $this->daysRemaining
                ? "متبقي {$this->daysRemaining} أيام على انتهاء صلاحية مشروع \"{$projectName}\". يمكنك تمديد المدة."
                : "انتهت صلاحية المشروع \"{$projectName}\". تم إخفاؤه عن الزوار.",
        ];
    }
}
