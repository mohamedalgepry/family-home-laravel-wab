<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\UnitExpiryNotification;
use App\Domain\Listings\Notifications\UnitExtendedNotification;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Extends a unit's lifetime from the admin notification actions, keeping the
 * listing cache, notification state and the owner's notification in sync.
 */
class ExtendUnitListingAction
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    public function execute(Unit $unit, int $days, User $admin): ?CarbonInterface
    {
        $oldAutoDeleteAt = $unit->auto_delete_at;
        $newAutoDeleteAt = null;

        DB::transaction(function () use ($unit, $days, &$newAutoDeleteAt) {
            $lockedUnit = Unit::where('id', $unit->id)->lockForUpdate()->firstOrFail();

            if ($lockedUnit->is_active && $lockedUnit->auto_delete_at && $lockedUnit->auto_delete_at->isFuture()) {
                $newAutoDeleteAt = $lockedUnit->auto_delete_at->copy()->addDays($days);
            } else {
                $newAutoDeleteAt = now()->addDays($days);
            }

            $lockedUnit->is_active = true;
            $lockedUnit->auto_delete_at = $newAutoDeleteAt;
            $lockedUnit->save();
        });

        Log::info('Unit extended by admin', [
            'admin_id' => $admin->id,
            'unit_id' => $unit->id,
            'old_auto_delete_at' => $oldAutoDeleteAt?->toIso8601String(),
            'new_auto_delete_at' => $newAutoDeleteAt?->toIso8601String(),
            'extension_days' => $days,
        ]);

        $this->clearListingCache();

        $this->notificationService->markEntityNotificationsAsReadForAll(
            'unit_id',
            $unit->id,
            ['unit_expiry_warning', 'unit_expired'],
        );

        if ($unit->user && $unit->user_id !== $admin->id && $newAutoDeleteAt) {
            $unit->user->notify(new UnitExtendedNotification(
                unit: $unit,
                days: $days,
                newExpiresAt: $newAutoDeleteAt,
            ));
        }

        return $newAutoDeleteAt;
    }

    private function clearListingCache(): void
    {
        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable $e) {
            Log::warning('ExtendUnitListingAction: cache clear failed', ['error' => $e->getMessage()]);
        }
    }
}
