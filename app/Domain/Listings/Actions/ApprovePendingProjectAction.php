<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Publishes a project from its "new project" notification and clears listing caches.
 */
class ApprovePendingProjectAction
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function execute(Project $project, User $admin): void
    {
        $project->update(['is_active' => true]);

        $this->clearListingCache();

        $this->notificationService->markEntityNotificationsAsRead(
            $admin,
            'project_id',
            $project->id,
            'new_project_created',
        );
    }

    private function clearListingCache(): void
    {
        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable $e) {
            Log::warning('ApprovePendingProjectAction: cache clear failed', ['error' => $e->getMessage()]);
        }
    }
}
