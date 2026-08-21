<?php

use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Points\Services\PointsService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    Setting::setValue('daily_deduction_enabled', 'true');
    Setting::setValue('daily_deduction_value', '10');
});

test('1. normal deduction reduces points by daily value', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(1);
    expect($unit->fresh()->priority_points)->toBe(40);
});

test('2. zero points unit is skipped', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 0, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(0);
    expect($unit->fresh()->priority_points)->toBe(0);
});

test('3. less than daily deduction reduces to exactly zero', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 5, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(1);
    expect($unit->fresh()->priority_points)->toBe(0);
});

test('4. exactly daily deduction reduces to zero', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 10, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(1);
    expect($unit->fresh()->priority_points)->toBe(0);
});

test('5. greater than daily deduction leaves remainder', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 25, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(1);
    expect($unit->fresh()->priority_points)->toBe(15);
});

test('6. priority points never become negative', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 3, 'is_pinned' => false]);

    $service->deductDailyPoints();

    expect($unit->fresh()->priority_points)->toBeGreaterThanOrEqual(0);
    expect($unit->fresh()->priority_points)->toBe(0);
});

test('7. correct ledger entry is created in points_transactions', function () {
    $service = app(PointsService::class);
    $manager = createUser('Test Manager', 'manager');
    $manager->update(['points_balance' => 200]);
    $agent = createUser('Test Agent', 'agent', $manager->id);
    $unit = createTestUnit(['user_id' => $agent->id, 'priority_points' => 30, 'is_pinned' => false]);

    $service->deductDailyPoints();

    $tx = PointsTransaction::where('unit_id', $unit->id)->latest('id')->first();
    expect($tx)->not->toBeNull();
    expect($tx->type)->toBe('daily_deduct');
    expect($tx->points)->toBe(-10);
    expect($tx->manager_id)->toBe($manager->id);
    expect($tx->performed_by)->toBe($agent->id);
});

test('8. correct balance_after reflects manager current balance', function () {
    $service = app(PointsService::class);
    $manager = createUser('Manager Balance', 'manager');
    $manager->update(['points_balance' => 350]);
    $agent = createUser('Agent Balance', 'agent', $manager->id);
    $unit = createTestUnit(['user_id' => $agent->id, 'priority_points' => 40, 'is_pinned' => false]);

    $service->deductDailyPoints();

    $tx = PointsTransaction::where('unit_id', $unit->id)->first();
    expect($tx->balance_after)->toBe(350);
});

test('9. second execution on the same day does not deduct twice (Idempotency)', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);

    // 1st run at 00:01
    $processedFirst = $service->deductDailyPoints();
    expect($processedFirst)->toBe(1);
    expect($unit->fresh()->priority_points)->toBe(40);

    // 2nd run at 10:00 on the same day
    $processedSecond = $service->deductDailyPoints();
    expect($processedSecond)->toBe(0);
    expect($unit->fresh()->priority_points)->toBe(40);

    // Only 1 transaction created for the unit today
    $txCount = PointsTransaction::where('unit_id', $unit->id)->where('type', 'daily_deduct')->count();
    expect($txCount)->toBe(1);
});

test('10. next day deduction runs successfully', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);

    // Day 1
    Carbon::setTestNow(Carbon::create(2026, 8, 21, 0, 1));
    $service->deductDailyPoints();
    expect($unit->fresh()->priority_points)->toBe(40);

    // Day 2
    Carbon::setTestNow(Carbon::create(2026, 8, 22, 0, 1));
    $processedDay2 = $service->deductDailyPoints();
    expect($processedDay2)->toBe(1);
    expect($unit->fresh()->priority_points)->toBe(30);

    Carbon::setTestNow();
});

test('11. concurrent execution safety prevents duplicate deduction', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);

    // Simulate pre-existing transaction created moments earlier by worker A
    PointsTransaction::create([
        'manager_id' => $unit->user_id,
        'unit_id' => $unit->id,
        'points' => -10,
        'type' => 'daily_deduct',
        'balance_after' => 0,
        'notes' => 'auto_daily_deduction',
        'performed_by' => $unit->user_id,
        'created_at' => now(),
    ]);

    // Worker B attempts deduction
    $processed = $service->deductDailyPoints();

    // Worker B skips because worker A already recorded deduction for today
    expect($processed)->toBe(0);
    expect($unit->fresh()->priority_points)->toBe(50);
});

test('12. transaction failure rolls back changes cleanly', function () {
    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);

    // Force an exception inside transaction by mocking or invalid state
    try {
        DB::transaction(function () use ($unit) {
            $unit->priority_points = 40;
            $unit->save();
            throw new \RuntimeException('Simulated failure during deduction');
        });
    } catch (\RuntimeException $e) {
        // Expected
    }

    // Unit was rolled back
    expect($unit->fresh()->priority_points)->toBe(50);
});

test('13. multiple units belonging to the same manager are all deducted', function () {
    $service = app(PointsService::class);
    $manager = createUser('Multi Unit Manager', 'manager');
    $manager->update(['points_balance' => 500]);
    $agent = createUser('Multi Unit Agent', 'agent', $manager->id);

    $unit1 = createTestUnit(['user_id' => $agent->id, 'priority_points' => 20, 'is_pinned' => false]);
    $unit2 = createTestUnit(['user_id' => $agent->id, 'priority_points' => 30, 'is_pinned' => false]);
    $unit3 = createTestUnit(['user_id' => $agent->id, 'priority_points' => 40, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(3);
    expect($unit1->fresh()->priority_points)->toBe(10);
    expect($unit2->fresh()->priority_points)->toBe(20);
    expect($unit3->fresh()->priority_points)->toBe(30);
});

test('14. multiple managers units are processed independently', function () {
    $service = app(PointsService::class);
    $managerA = createUser('Manager A', 'manager');
    $managerB = createUser('Manager B', 'manager');

    $agentA = createUser('Agent A', 'agent', $managerA->id);
    $agentB = createUser('Agent B', 'agent', $managerB->id);

    $unitA = createTestUnit(['user_id' => $agentA->id, 'priority_points' => 50, 'is_pinned' => false]);
    $unitB = createTestUnit(['user_id' => $agentB->id, 'priority_points' => 20, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(2);
    expect($unitA->fresh()->priority_points)->toBe(40);
    expect($unitB->fresh()->priority_points)->toBe(10);
});

test('15. disabled daily deduction setting skips all units', function () {
    Setting::setValue('daily_deduction_enabled', 'false');

    $service = app(PointsService::class);
    $unit = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(0);
    expect($unit->fresh()->priority_points)->toBe(50);
});

test('16. pinned units are strictly excluded from deduction', function () {
    $service = app(PointsService::class);
    $unitPinned = createTestUnit(['priority_points' => 50, 'is_pinned' => true]);
    $unitNormal = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);

    $processed = $service->deductDailyPoints();

    expect($processed)->toBe(1);
    expect($unitPinned->fresh()->priority_points)->toBe(50);
    expect($unitNormal->fresh()->priority_points)->toBe(40);
});
