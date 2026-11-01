<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\UnitService;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;

/**
 * Publishes a unit from its pending-approval notification, or just acknowledges
 * a stale notification when the unit is already published.
 */
class ApprovePendingUnitAction
{
    public function __construct(
        private readonly UnitService $unitService,
        private readonly NotificationService $notificationService,
    ) {}

    /**
     * @return bool True when this call actually activated the unit.
     */
    public function execute(Unit $unit, User $admin): bool
    {
        if ($unit->is_active) {
            // Already published: acknowledge the stale pending-approval notification
            // without toggling the active state off or deleting the card.
            $this->notificationService->markEntityNotificationsAsRead(
                $admin,
                'unit_id',
                $unit->id,
                'unit_pending_approval',
            );

            return false;
        }

        $this->unitService->toggleActive($unit->id, $admin);

        $this->notificationService->markEntityNotificationsAsRead(
            $admin,
            'unit_id',
            $unit->id,
            'unit_pending_approval',
        );

        return true;
    }
}
