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

        $managers = User::managers()
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

        return $transaction;
    }

    public function monthlyReset(?User $performedBy = null): int
    {
        $performedBy = $performedBy ?? request()?->user();

        return DB::transaction(function () use ($performedBy) {
            $managers = User::managers()->get(['id', 'points_balance', 'initial_monthly_balance']);

            $transactions = [];
            $now = Carbon::now();

            foreach ($managers as $manager) {
                if ($manager->points_balance != $manager->initial_monthly_balance) {
                    $amount = $manager->initial_monthly_balance - $manager->points_balance;
                    $transactions[] = [
                        'manager_id' => $manager->id,
                        'unit_id' => null,
                        'type' => 'monthly_reset',
                        'points' => $amount,
                        'balance_after' => $manager->initial_monthly_balance,
                        'performed_by' => $performedBy?->id,
                        'created_at' => $now,
                    ];
                }
            }

            if (! empty($transactions)) {
                // Chunk inserts to avoid query size limits on many managers
                foreach (array_chunk($transactions, 500) as $chunk) {
                    PointsTransaction::insert($chunk);
                }
            }

            $updated = User::managers()
                ->update(['points_balance' => DB::raw('`initial_monthly_balance`')]);

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
        $startOfDay = $now->copy()->startOfDay();
        $endOfDay = $now->copy()->endOfDay();

        // 1. Query only units that have NOT already had a daily deduction today (Idempotency Step 1)
        Unit::with(['user.manager'])
            ->where('is_pinned', false)
            ->where('priority_points', '>', 0)
            ->whereDoesntHave('pointsTransactions', function ($q) use ($startOfDay, $endOfDay) {
                $q->where('type', 'daily_deduct')
                    ->whereBetween('created_at', [$startOfDay, $endOfDay]);
            })
            ->chunkById(100, function ($units) use ($value, $now, $startOfDay, $endOfDay, &$processedCount) {
                DB::transaction(function () use ($units, $value, $now, $startOfDay, $endOfDay, &$processedCount) {
                    $unitIds = $units->pluck('id')->toArray();

                    // 2. Lock units and eager load users to prevent N+1 queries
                    $lockedUnits = Unit::with('user')->lockForUpdate()->whereIn('id', $unitIds)->get();

                    // 3. Concurrency check: find any units in this chunk already deducted today (Idempotency Step 2)
                    $alreadyDeductedUnitIds = PointsTransaction::whereIn('unit_id', $unitIds)
                        ->where('type', 'daily_deduct')
                        ->whereBetween('created_at', [$startOfDay, $endOfDay])
                        ->pluck('unit_id')
                        ->flip()
                        ->toArray();

                    // 4. Collect unique manager IDs and lock their rows for fresh balance
                    $managerIds = $lockedUnits->map(fn ($u) => $u->user?->manager_id ?? $u->user_id)->unique()->filter();
                    $managers = User::lockForUpdate()->whereIn('id', $managerIds)->pluck('points_balance', 'id');

                    $transactions = [];
                    $validUnitIds = [];

                    foreach ($lockedUnits as $unit) {
                        // Skip if already deducted in another concurrent transaction
                        if (isset($alreadyDeductedUnitIds[$unit->id])) {
                            continue;
                        }

                        // Skip if points were depleted concurrently
                        if ($unit->priority_points <= 0) {
                            continue;
                        }

                        $deduction = min($unit->priority_points, $value);
                        $newPoints = max(0, $unit->priority_points - $deduction);

                        // Collect valid unit ID for bulk update instead of individual save
                        $validUnitIds[] = $unit->id;

                        $managerId = $unit->user?->manager_id ?? $unit->user_id;

                        $transactions[] = [
                            'manager_id' => $managerId,
                            'unit_id' => $unit->id,
                            'points' => -$deduction,
                            'type' => 'daily_deduct',
                            'balance_after' => $managers[$managerId] ?? 0,
                            'notes' => 'auto_daily_deduction (Unit Remaining: '.$newPoints.')',
                            'performed_by' => $unit->user_id,
                            'created_at' => $now,
                        ];

                        $processedCount++;
                    }

                    if (! empty($validUnitIds)) {
                        Unit::whereIn('id', $validUnitIds)->update([
                            'priority_points' => DB::raw("GREATEST(0, priority_points - {$value})")
                        ]);
                    }

                    if (! empty($transactions)) {
                        PointsTransaction::insert($transactions);
                    }
                });
            });

        return $processedCount;
    }
}
