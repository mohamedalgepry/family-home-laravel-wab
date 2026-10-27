<?php

namespace App\Domain\Listings\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ProjectPermanentlyDeletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 30, 60];

    public int $timeout = 30;

    public function __construct(
        public int $projectId,
        public string $projectNameAr,
        public string $projectNameEn,
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $projectName = $this->projectNameAr ?: $this->projectNameEn;

        return [
            'type' => 'project_permanently_deleted',
            'title' => 'تم حذف المشروع نهائياً',
            'title_en' => 'Project Permanently Deleted',
            'project_id' => $this->projectId,
            'project_name' => $projectName,
            'project_name_ar' => $this->projectNameAr,
            'project_name_en' => $this->projectNameEn,
            'message' => "تم حذف المشروع «{$projectName}» نهائياً بعد انتهاء فترة السماح.",
            'message_en' => "Project “{$this->projectNameEn}” was permanently deleted after the grace period expired.",
        ];
    }
}
