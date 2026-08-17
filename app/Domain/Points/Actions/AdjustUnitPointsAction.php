<?php

namespace App\Domain\Points\Actions;

use App\Domain\Listings\Models\Unit;
use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class AdjustUnitPointsAction
{
    public function execute(Unit $unit, int $newPoints, User $admin): void
    {
        DB::transaction(function () use ($unit, $newPoints, $admin) {
            $oldPoints = $unit->priority_points;

            // 1. Refund to the manager if there was a previous allocation
            if ($oldPoints > 0) {
                $lastAllocation = PointsTransaction::where('unit_id', $unit->id)
                    ->whereIn('type', ['allocate', 'admin_adjust'])
                    ->latest()
                    ->first();

                if ($lastAllocation && $lastAllocation->manager_id && $lastAllocation->type === 'allocate') {
                    $manager = User::lockForUpdate()->find($lastAllocation->manager_id);
                    if ($manager) {
                        $manager->increment('points_balance', $oldPoints);

                        PointsTransaction::create([
                            'manager_id' => $manager->id,
                            'unit_id' => $unit->id,
                            'points' => $oldPoints,
                            'type' => 'refund',
                            'balance_after' => $manager->fresh()->points_balance,
                            'notes' => 'Refund for admin adjustment',
                            'performed_by' => $admin->id,
                        ]);
                    }
                }
            }

            // 2. Update unit points
            $unit->priority_points = $newPoints;
            $unit->save();

            // 3. Record the new admin adjustment transaction
            // Admin doesn't have a points_balance, but we log the transaction under the admin
            if ($newPoints > 0) {
                PointsTransaction::create([
                    'manager_id' => $admin->id, // Here we use the admin's ID
                    'unit_id' => $unit->id,
                    'points' => -$newPoints,
                    'type' => 'admin_adjust',
                    'balance_after' => 0, // Admin has unlimited balance
                    'notes' => 'Admin override',
                    'performed_by' => $admin->id,
                ]);
            }
        });
    }
}
