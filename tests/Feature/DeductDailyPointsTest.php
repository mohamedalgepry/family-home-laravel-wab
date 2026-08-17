<?php

use App\Domain\Points\Services\PointsService;

test('deduct daily points reduces priority points correctly and persists to database', function () {
    $service = app(PointsService::class);
    
    // Case 1: Unit with priority_points = 50 -> should become 40
    $unitNormal = createTestUnit(['priority_points' => 50, 'is_pinned' => false]);
    
    // Case 2: Pinned unit with priority_points = 50 -> should remain 50
    $unitPinned = createTestUnit(['priority_points' => 50, 'is_pinned' => true]);
    
    // Case 3: Unit with priority_points = 0 -> should remain 0
    $unitZero = createTestUnit(['priority_points' => 0, 'is_pinned' => false]);
    
    $processed = $service->deductDailyPoints();
    
    // Assert 1 processed (only the normal unit > 0 and not pinned)
    expect($processed)->toBe(1);
    
    // Assert persistence
    expect($unitNormal->fresh()->priority_points)->toBe(40);
    expect($unitPinned->fresh()->priority_points)->toBe(50);
    expect($unitZero->fresh()->priority_points)->toBe(0);
});
