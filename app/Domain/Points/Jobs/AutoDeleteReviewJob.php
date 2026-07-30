<?php

namespace App\Domain\Points\Jobs;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\ProjectExpiryWarningNotification;
use App\Domain\Listings\Notifications\UnitExpiryNotification;
use App\Domain\Users\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AutoDeleteReviewJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $this->processUnits();
        $this->processProjects();
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
        }

        $cleanupDays = (int) Setting::getValue('cleanup_deleted_days', '7');
        $oldDeactivated = Unit::where('is_active', false)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '<=', now()->subDays($cleanupDays))
            ->get();

        if ($oldDeactivated->isNotEmpty()) {
            $ids = $oldDeactivated->pluck('id')->toArray();
            DB::transaction(function () use ($ids) {
                Unit::whereIn('id', $ids)->delete();
            });

            Log::info('AutoDeleteReviewJob: permanently deleted old deactivated units.', [
                'count' => count($ids),
            ]);
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
        }

        $cleanupDays = (int) Setting::getValue('cleanup_deleted_days', '7');
        $oldDeactivated = Project::where('is_active', false)
            ->whereNotNull('auto_delete_at')
            ->where('auto_delete_at', '<=', now()->subDays($cleanupDays))
            ->get();

        if ($oldDeactivated->isNotEmpty()) {
            $ids = $oldDeactivated->pluck('id')->toArray();
            DB::transaction(function () use ($ids) {
                Project::whereIn('id', $ids)->delete();
            });

            Log::info('AutoDeleteReviewJob: permanently deleted old deactivated projects.', [
                'count' => count($ids),
            ]);
        }
    }
}
