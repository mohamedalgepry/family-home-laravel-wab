<?php

use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Artisan;

test('points:cleanup deletes daily_deduct transactions older than 180 days', function () {
    $manager = createUser('Manager Test '.uniqid(), 'manager');

    // Old daily deduction (> 180 days)
    $oldDeduct = PointsTransaction::create([
        'manager_id' => $manager->id,
        'points' => -10,
        'type' => 'daily_deduct',
        'balance_after' => 100,
        'created_at' => now()->subDays(181),
    ]);

    // Recent daily deduction (< 180 days)
    $recentDeduct = PointsTransaction::create([
        'manager_id' => $manager->id,
        'points' => -10,
        'type' => 'daily_deduct',
        'balance_after' => 90,
        'created_at' => now()->subDays(30),
    ]);

    // Old allocate transaction (> 180 days) - should NOT be deleted
    $oldAllocate = PointsTransaction::create([
        'manager_id' => $manager->id,
        'points' => 500,
        'type' => 'allocate',
        'balance_after' => 500,
        'created_at' => now()->subDays(200),
    ]);

    // Old monthly reset transaction (> 180 days) - should NOT be deleted
    $oldReset = PointsTransaction::create([
        'manager_id' => $manager->id,
        'points' => 1000,
        'type' => 'monthly_reset',
        'balance_after' => 1000,
        'created_at' => now()->subDays(200),
    ]);

    Artisan::call('points:cleanup');

    expect(PointsTransaction::find($oldDeduct->id))->toBeNull()
        ->and(PointsTransaction::find($recentDeduct->id))->not->toBeNull()
        ->and(PointsTransaction::find($oldAllocate->id))->not->toBeNull()
        ->and(PointsTransaction::find($oldReset->id))->not->toBeNull();
});

test('points:cleanup respects custom --days option', function () {
    $manager = createUser('Manager Option '.uniqid(), 'manager');

    $deduct60Days = PointsTransaction::create([
        'manager_id' => $manager->id,
        'points' => -10,
        'type' => 'daily_deduct',
        'balance_after' => 100,
        'created_at' => now()->subDays(61),
    ]);

    $deduct20Days = PointsTransaction::create([
        'manager_id' => $manager->id,
        'points' => -10,
        'type' => 'daily_deduct',
        'balance_after' => 90,
        'created_at' => now()->subDays(20),
    ]);

    Artisan::call('points:cleanup', ['--days' => 60]);

    expect(PointsTransaction::find($deduct60Days->id))->toBeNull()
        ->and(PointsTransaction::find($deduct20Days->id))->not->toBeNull();
});
