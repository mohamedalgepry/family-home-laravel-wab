<?php

use App\Domain\Listings\Models\Unit;
test('admin can adjust points for any unit', function () {
    $admin = createUser('Admin User', 'admin');
    $unit = createTestUnit([]);

    $response = $this->actingAs($admin)->post(route('admin.units.adjust-points', $unit), [
        'points' => 150,
    ]);

    $response->assertRedirect();
    $this->assertEquals(150, $unit->fresh()->priority_points);
});

test('manager cannot adjust points via adjust-points route', function () {
    $manager = createUser('Manager User', 'manager');
    $agent = createUser('Agent in Team', 'agent', $manager->id);

    // Create a unit owned by an agent in the manager's team
    $unit = createTestUnit(['user_id' => $agent->id]);

    $response = $this->actingAs($manager)->post(route('admin.units.adjust-points', $unit), [
        'points' => 100,
    ]);

    $response->assertForbidden();
});

test('agent cannot adjust points', function () {
    $agent = createUser('Agent Cannot Adjust', 'agent');
    $unit = createTestUnit(['user_id' => $agent->id]);

    $response = $this->actingAs($agent)->post(route('admin.units.adjust-points', $unit), [
        'points' => 100,
    ]);

    $response->assertForbidden();
});
