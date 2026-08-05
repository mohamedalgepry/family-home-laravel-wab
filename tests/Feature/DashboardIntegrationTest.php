<?php

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Cache;

test('admin dashboard renders successfully and caches statistics per user', function () {
    $admin = createUser('Admin Verification', 'admin', null);

    Cache::forget('dashboard_stats_'.$admin->id);
    Cache::forget('dashboard_top_projects_10_'.$admin->id);
    Cache::forget('dashboard_top_units_10_'.$admin->id);
    Cache::forget('dashboard_recent_units_5_'.$admin->id);
    Cache::forget('dashboard_recent_messages_5_'.$admin->id);
    Cache::forget('dashboard_visits_chart_30_'.$admin->id);

    $response = $this->actingAs($admin)->get('/admin');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Dashboard')
        ->has('stats')
        ->has('topProjects')
        ->has('topUnits')
        ->has('recentUnits')
        ->has('recentMessages')
        ->has('visitsChart')
    );

    // Verify cache keys created
    $this->assertTrue(Cache::has('dashboard_stats_'.$admin->id));
    $this->assertTrue(Cache::has('dashboard_top_projects_10_'.$admin->id));
    $this->assertTrue(Cache::has('dashboard_top_units_10_'.$admin->id));
    $this->assertTrue(Cache::has('dashboard_recent_units_5_'.$admin->id));
    $this->assertTrue(Cache::has('dashboard_recent_messages_5_'.$admin->id));
    $this->assertTrue(Cache::has('dashboard_visits_chart_30_'.$admin->id));

    // Repeat GET request - served from cache
    $response2 = $this->actingAs($admin)->get('/admin');
    $response2->assertOk();
});

test('manager dashboard renders successfully and caches separately from admin', function () {
    $manager = createUser('Manager Verification', 'manager', null);

    Cache::forget('dashboard_stats_'.$manager->id);

    $response = $this->actingAs($manager)->get('/admin');

    $response->assertOk();
    $this->assertTrue(Cache::has('dashboard_stats_'.$manager->id));
});
