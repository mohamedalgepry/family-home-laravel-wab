<?php

namespace App\Domain\Points\Services;

use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\SettingsService;
use App\Domain\Points\Actions\AllocatePointsAction;
use App\Domain\Points\DTOs\AllocatePointsData;
use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Users\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PointsService
{
    public function index(array $filters = [], ?User $user = null)
    {
        $user = $user ?? request()?->user();

        $managers = User::where('role', 'manager')
            ->withCount('units')
            ->orderBy('points_balance', 'desc')
            ->paginate(15);

        $ledgerQuery = PointsTransaction::with(['manager:id,name', 'unit:id,name,slug']);

        if ($user && ! $user->isAdmin()) {
            $ledgerQuery->where('manager_id', $user->id);
        }

        if (! empty($filters['manager_id'])) {
            $ledgerQuery->where('manager_id', $filters['manager_id']);
        }

        if (! empty($filters['type'])) {
            $ledgerQuery->where('type', $filters['type']);
        }

        $ledger = $ledgerQuery->orderByDesc('created_at')->paginate(15, ['*'], 'ledger_page');

        return compact('managers', 'ledger');
    }

    public function allocate(AllocatePointsData $data, ?User $performedBy = null): PointsTransaction
    {
        $performedBy = $performedBy ?? request()?->user();
        $performedById = $performedBy?->id ?? $data->manager_id;

        $action = app(AllocatePointsAction::class);

        $transaction = $action->execute($data, $performedById);

        $activity = activity()
            ->performedOn(User::find($data->manager_id));

        if ($performedBy) {
            $activity->causedBy($performedBy);
        }

        $activity->withProperties([
            'points' => $data->points,
            'unit_id' => $data->unit_id,
            'balance_after' => $transaction->balance_after,
        ])->log('allocated_points');

        return $transaction;
    }

    public function monthlyReset(?User $performedBy = null): int
    {
        $performedBy = $performedBy ?? request()?->user();

        return DB::transaction(function () use ($performedBy) {
            $updated = User::where('role', 'manager')
                ->update(['points_balance' => DB::raw('initial_monthly_balance')]);

            $activity = activity();
            if ($performedBy) {
                $activity->causedBy($performedBy);
            }
            $activity->log('monthly_points_reset');

            return $updated;
        });
    }

    public function deductDailyPoints(): int
    {
        $settingsService = app(SettingsService::class);
        $enabled = $settingsService->get('daily_deduction_enabled', 'true');
        if ($enabled !== 'true' && $enabled !== '1' && $enabled !== true) {
            return 0;
        }

        $value = (int) $settingsService->get('daily_deduction_value', '10');

        if ($value <= 0) {
            return 0;
        }

        $processedCount = 0;
        $now = Carbon::now();

        Unit::with('user')
            ->where('is_pinned', false)
            ->where('priority_points', '>', 0)
            ->chunk(100, function ($units) use ($value, $now, &$processedCount) {
                $transactions = [];

                foreach ($units as $unit) {
                    $deduction = min($unit->priority_points, $value);
                    $newPoints = max(0, $unit->priority_points - $deduction);

                    $unit->update(['priority_points' => $newPoints]);

                    $transactions[] = [
                        'manager_id' => $unit->user?->manager_id ?? $unit->user_id,
                        'unit_id' => $unit->id,
                        'points' => -$deduction,
                        'type' => 'daily_deduct',
                        'balance_after' => $newPoints,
                        'notes' => 'خصم يومي تلقائي للنقاط',
                        'performed_by' => $unit->user_id,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $processedCount++;
                }

                PointsTransaction::insert($transactions);
            });

        if ($processedCount === 0) {
            return 0;
        }

        activity()
            ->withProperties(['units_deducted' => $processedCount, 'deduction_value' => $value])
            ->log('daily_points_deduction');

        return $processedCount;
    }
}
