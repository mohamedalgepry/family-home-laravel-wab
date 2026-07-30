<?php

namespace App\Domain\Points\Actions;

use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Points\DTOs\AllocatePointsData;
use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AllocatePointsAction
{
    public function execute(AllocatePointsData $data, int $performedBy): PointsTransaction
    {
        return DB::transaction(function () use ($data, $performedBy) {
            $manager = User::where('id', $data->manager_id)->lockForUpdate()->firstOrFail();

            $minPoints = (int) Setting::getValue('min_points_allocation', '1');
            if ($data->points < $minPoints) {
                throw ValidationException::withMessages([
                    'points' => __('Minimum allocation threshold is :min points.', ['min' => $minPoints]),
                ]);
            }

            if ($manager->points_balance < $data->points) {
                throw ValidationException::withMessages([
                    'points' => __('Insufficient points balance.'),
                ]);
            }

            $newBalance = $manager->points_balance - $data->points;
            $manager->points_balance = $newBalance;
            $manager->save();

            if ($data->unit_id) {
                $unit = Unit::where('id', $data->unit_id)->lockForUpdate()->firstOrFail();
                $unit->increment('priority_points', $data->points);
            }

            return PointsTransaction::create([
                'manager_id' => $data->manager_id,
                'unit_id' => $data->unit_id,
                'points' => -$data->points,
                'type' => 'allocate',
                'balance_after' => $newBalance,
                'notes' => $data->notes,
                'performed_by' => $performedBy,
                'created_at' => now(),
            ]);
        });
    }
}
