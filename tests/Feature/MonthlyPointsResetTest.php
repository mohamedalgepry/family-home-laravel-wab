<?php

use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Points\Services\PointsService;

test('monthly reset creates points transactions for managers with altered balances', function () {
    $admin = createUser('Admin User', 'admin');
    $manager1 = createUser('Manager One', 'manager');
    $manager2 = createUser('Manager Two', 'manager');
    $manager3 = createUser('Manager Three', 'manager');

    // manager1 has fewer points (should get positive amount transaction)
    $manager1->forceFill([
        'initial_monthly_balance' => 500,
        'points_balance' => 450,
    ])->save();

    // manager2 has more points (should get negative amount transaction)
    $manager2->forceFill([
        'initial_monthly_balance' => 500,
        'points_balance' => 550,
    ])->save();

    // manager3 has exactly the initial balance (should NOT get a transaction)
    $manager3->forceFill([
        'initial_monthly_balance' => 500,
        'points_balance' => 500,
    ])->save();

    $pointsService = app(PointsService::class);

    // Acting as admin
    $this->actingAs($admin);

    $updatedCount = $pointsService->monthlyReset($admin);

    $this->assertGreaterThanOrEqual(2, $updatedCount); // At least our 2 altered managers were updated

    $this->assertEquals(500, $manager1->fresh()->points_balance);
    $this->assertEquals(500, $manager2->fresh()->points_balance);
    $this->assertEquals(500, $manager3->fresh()->points_balance);

    $tx1 = PointsTransaction::where('manager_id', $manager1->id)->where('type', 'monthly_reset')->first();
    $this->assertNotNull($tx1);
    $this->assertEquals(50, $tx1->points);
    $this->assertEquals(500, $tx1->balance_after);
    $this->assertEquals($admin->id, $tx1->performed_by);

    $tx2 = PointsTransaction::where('manager_id', $manager2->id)->where('type', 'monthly_reset')->first();
    $this->assertNotNull($tx2);
    $this->assertEquals(-50, $tx2->points);
    $this->assertEquals(500, $tx2->balance_after);
    $this->assertEquals($admin->id, $tx2->performed_by);

    $tx3 = PointsTransaction::where('manager_id', $manager3->id)->where('type', 'monthly_reset')->first();
    $this->assertNull($tx3); // No change, no transaction
});
