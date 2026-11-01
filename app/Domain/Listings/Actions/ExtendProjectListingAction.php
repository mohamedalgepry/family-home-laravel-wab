<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use Illuminate\Support\Facades\Log;

/**
 * Extends a project's lifetime from the admin notification actions.
 */
class ExtendProjectListingAction
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    /**
     * @return int The number of days the project was extended by.
     */
    public function execute(Project $project, User $admin): int
    {
        $days = $this->extensionDays();

        $project->update([
            'is_active' => true,
            'auto_delete_at' => now()->addDays($days),
        ]);

        $this->clearListingCache();

        $this->notificationService->markEntityNotificationsAsRead($admin, 'project_id', $project->id);

        return $days;
    }

    private function extensionDays(): int
    {
        $days = (int) Setting::getValue('auto_delete_days', '30');

        return $days > 0 ? $days : 30;
    }

    private function clearListingCache(): void
    {
        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable $e) {
            Log::warning('ExtendProjectListingAction: cache clear failed', ['error' => $e->getMessage()]);
        }
    }
}
