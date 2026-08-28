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

            $newBalance = $manager->points_balance;

            if ($data->unit_id) {
                $unit = Unit::where('id', $data->unit_id)->lockForUpdate()->firstOrFail();

                // تصفير النقاط الحالية للوحدة واسترداد الرصيد للمدير
                $previousPoints = (int) $unit->priority_points;
                if ($previousPoints > 0) {
                    $newBalance += $previousPoints;
                }

                // خصم النقاط الجديدة من الرصيد (بعد الاسترداد)
                $newBalance -= $data->points;

                if ($newBalance < 0) {
                    throw ValidationException::withMessages([
                        'points' => __('Insufficient points balance.'),
                    ]);
                }

                $manager->points_balance = $newBalance;
                $manager->save();

                // تعيين النقاط الجديدة (ليس increment بل تعيين مباشر)
                $unit->priority_points = $data->points;
                $unit->save();
            } else {
                $newBalance -= $data->points;
                $manager->points_balance = $newBalance;
                $manager->save();
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
