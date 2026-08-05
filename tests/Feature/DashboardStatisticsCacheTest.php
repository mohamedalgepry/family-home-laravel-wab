<?php

use App\Domain\Listings\Services\StatisticsService;
use Illuminate\Support\Facades\Cache;

test('statistics service caches getStats results for user', function () {
    $service = new StatisticsService();
    $admin = createUser('Admin User', 'admin', null);

    Cache::forget('dashboard_stats_'.$admin->id);

    $stats1 = $service->getStats($admin);

    $this->assertTrue(Cache::has('dashboard_stats_'.$admin->id));

    $cachedStats = Cache::get('dashboard_stats_'.$admin->id);
    $this->assertEquals($stats1, $cachedStats);
});

test('statistics service uses separate cache keys for different users', function () {
    $service = new StatisticsService();
    $user1 = createUser('Manager User', 'manager', null);
    $user2 = createUser('Agent User', 'agent', null);

    Cache::forget('dashboard_stats_'.$user1->id);
    Cache::forget('dashboard_stats_'.$user2->id);

    $service->getStats($user1);
    $service->getStats($user2);

    $this->assertTrue(Cache::has('dashboard_stats_'.$user1->id));
    $this->assertTrue(Cache::has('dashboard_stats_'.$user2->id));
});
