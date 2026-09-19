<?php

namespace App\Domain\Points\Jobs;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\ProjectExpiryWarningNotification;
use App\Domain\Listings\Notifications\UnitExpiryNotification;
use App\Domain\Listings\Services\SitemapService;
use App\Domain\Users\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AutoDeleteReviewJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 60;

    public array $backoff = [30, 60, 120];

    private bool $listingsChanged = false;

    public function handle(SitemapService $sitemapService): void
    {
        $this->processUnits();
        $this->processProjects();

        if ($this->listingsChanged) {
            $sitemapService->regenerate();
        }
    }

    protected function processUnits(): void
    {
        $warningDays = (int) Setting::getValue('expiry_warning_days', '3');
        $admins = User::whereIn('role', ['admin', 'manager'])->get(['id']);

        $expiringSoon = Unit::where('is_active', true)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '>', now())
            ->where('auto_delete_at', '<=', now()->addDays($warningDays))
            ->get();

        foreach ($expiringSoon as $unit) {
            $daysRemaining = now()->diffInDays($unit->auto_delete_at);
            foreach ($admins as $admin) {
                $admin->notify(new UnitExpiryNotification($unit, 'warning', (int) $daysRemaining));
            }
        }

        $expired = Unit::where('is_active', true)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '<=', now())
            ->get();

        if ($expired->isNotEmpty()) {
            $expiredIds = $expired->pluck('id')->toArray();

            DB::transaction(function () use ($expiredIds) {
                Unit::whereIn('id', $expiredIds)->update(['is_active' => false]);
            });

            foreach ($expired as $unit) {
                foreach ($admins as $admin) {
                    $admin->notify(new UnitExpiryNotification($unit, 'expired'));
                }
            }

            Log::warning('AutoDeleteReviewJob: units deactivated.', [
                'count' => count($expiredIds),
                'unit_ids' => $expiredIds,
            ]);

            $this->listingsChanged = true;
        }

        $cleanupDays = (int) Setting::getValue('cleanup_deleted_days', '7');
        $oldDeactivated = Unit::where('is_active', false)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '<=', now()->subDays($cleanupDays))
            ->get();

        if ($oldDeactivated->isNotEmpty()) {
            $ids = $oldDeactivated->pluck('id')->toArray();

            // Load units with images and owners before deletion
            $unitsWithImages = Unit::with(['images', 'user'])->whereIn('id', $ids)->get();
            $allImagePaths = $unitsWithImages->flatMap(fn ($u) => $u->images->pluck('path'))->toArray();

            // Prepare notification payloads before deletion
            $notificationsToSend = [];
            foreach ($unitsWithImages as $unit) {
                $recipients = collect();
                if ($unit->user) {
                    $recipients->push($unit->user);
                }
                foreach ($admins as $admin) {
                    $recipients->push($admin);
                }
                $recipients = $recipients->unique('id');

                $notificationsToSend[] = [
                    'recipients' => $recipients,
                    'notification' => new \App\Domain\Listings\Notifications\UnitPermanentlyDeletedNotification(
                        unitId: $unit->id,
                        unitNameAr: $unit->name_ar ?: ($unit->name ?: ''),
                        unitNameEn: $unit->name_en ?: ($unit->name ?: ''),
                    ),
                ];
            }

            DB::transaction(function () use ($ids) {
                // Delete image records first, then units
                \App\Domain\Listings\Models\UnitImage::whereIn('unit_id', $ids)->delete();
                Unit::whereIn('id', $ids)->delete();
            });

            // Delete image files from disk after DB cleanup
            if (! empty($allImagePaths)) {
                $imageService = app(\App\Domain\Listings\Services\ListingImageService::class);
                $imageService->deleteImageFiles($allImagePaths);
            }

            // Send notifications ONLY after successful deletion and cleanup
            foreach ($notificationsToSend as $entry) {
                foreach ($entry['recipients'] as $recipient) {
                    $recipient->notify($entry['notification']);
                }
            }

            Log::info('AutoDeleteReviewJob: permanently deleted old deactivated units.', [
                'count' => count($ids),
            ]);

            $this->listingsChanged = true;
        }
    }

    protected function processProjects(): void
    {
        $warningDays = (int) Setting::getValue('expiry_warning_days', '3');
        $admins = User::whereIn('role', ['admin', 'manager'])->get(['id']);

        $expiringSoon = Project::where('is_active', true)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '>', now())
            ->where('auto_delete_at', '<=', now()->addDays($warningDays))
            ->get();

        foreach ($expiringSoon as $project) {
            $daysRemaining = now()->diffInDays($project->auto_delete_at);
            foreach ($admins as $admin) {
                $admin->notify(new ProjectExpiryWarningNotification($project, (int) $daysRemaining));
            }
        }

        $expired = Project::where('is_active', true)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '<=', now())
            ->get();

        if ($expired->isNotEmpty()) {
            $expiredIds = $expired->pluck('id')->toArray();

            DB::transaction(function () use ($expiredIds) {
                Project::whereIn('id', $expiredIds)->update(['is_active' => false]);
            });

            foreach ($expired as $project) {
                foreach ($admins as $admin) {
                    $admin->notify(new ProjectExpiryWarningNotification($project));
                }
            }

            Log::warning('AutoDeleteReviewJob: projects deactivated.', [
                'count' => count($expiredIds),
            ]);

            $this->listingsChanged = true;
        }

        $cleanupDays = (int) Setting::getValue('cleanup_deleted_days', '7');
        $oldDeactivated = Project::where('is_active', false)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '<=', now()->subDays($cleanupDays))
            ->get();

        if ($oldDeactivated->isNotEmpty()) {
            $ids = $oldDeactivated->pluck('id')->toArray();

            // Load images and owners before deletion
            $projectsWithImages = Project::with(['images', 'user'])->whereIn('id', $ids)->get();
            $allImagePaths = $projectsWithImages->flatMap(fn ($p) => $p->images->pluck('path'))->toArray();

            // Prepare notification payloads
            $projectNotificationsToSend = [];
            foreach ($projectsWithImages as $project) {
                $recipients = collect();
                if ($project->user) {
                    $recipients->push($project->user);
                }
                foreach ($admins as $admin) {
                    $recipients->push($admin);
                }
                $recipients = $recipients->unique('id');

                $projectNotificationsToSend[] = [
                    'recipients' => $recipients,
                    'notification' => new \App\Domain\Listings\Notifications\ProjectPermanentlyDeletedNotification(
                        projectId: $project->id,
                        projectNameAr: $project->name_ar ?: ($project->name ?: ''),
                        projectNameEn: $project->name_en ?: ($project->name ?: ''),
                    ),
                ];
            }

            DB::transaction(function () use ($ids) {
                \App\Domain\Listings\Models\ProjectImage::whereIn('project_id', $ids)->delete();
                Project::whereIn('id', $ids)->delete();
            });

            // Delete image files from disk after DB cleanup
            if (! empty($allImagePaths)) {
                $imageService = app(\App\Domain\Listings\Services\ListingImageService::class);
                $imageService->deleteImageFiles($allImagePaths);
            }

            // Send notifications ONLY after successful deletion and cleanup
            foreach ($projectNotificationsToSend as $entry) {
                foreach ($entry['recipients'] as $recipient) {
                    $recipient->notify($entry['notification']);
                }
            }

            Log::info('AutoDeleteReviewJob: permanently deleted old deactivated projects.', [
                'count' => count($ids),
            ]);

            $this->listingsChanged = true;
        }
    }
}
