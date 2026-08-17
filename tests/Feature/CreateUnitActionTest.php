<?php

use App\Domain\Listings\Actions\CreateUnitAction;
use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\UnitType;

test('create unit action sets restricted fields and sanitizes map embed url', function () {
    $admin = createUser('Admin', 'admin');
    $type = UnitType::firstOrCreate(['name_en' => 'Test Type', 'name_ar' => 'Test Type Ar', 'slug' => 'test-type']);
    $area = Area::firstOrCreate(['name_en' => 'Test Area', 'name_ar' => 'Test Area Ar', 'slug' => 'test-area']);

    $data = CreateUnitData::from([
        'name_en' => 'Test Unit',
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 100,
        'map_embed_url' => '<iframe src="https://maps.google.com/test"></iframe>',
        'is_active' => true,
        'user_id' => 999, // Should be ignored
        'priority_points' => 999, // Should be ignored
    ]);

    $action = app(CreateUnitAction::class);
    $unit = $action->execute($data, $admin);

    $this->assertEquals($admin->id, $unit->user_id); // Admin ID was explicitly set
    $this->assertEquals(0, $unit->priority_points); // Default value from DB, 999 was ignored
    $this->assertTrue((bool) $unit->is_active);
    $this->assertEquals('https://maps.google.com/test', $unit->map_embed_url);
});

test('create unit action clears invalid map embed urls', function () {
    $admin = createUser('Admin', 'admin');
    $type = UnitType::firstOrCreate(['name_en' => 'Test Type', 'name_ar' => 'Test Type Ar', 'slug' => 'test-type']);
    $area = Area::firstOrCreate(['name_en' => 'Test Area', 'name_ar' => 'Test Area Ar', 'slug' => 'test-area']);

    $data = CreateUnitData::from([
        'name_en' => 'Test Unit',
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 100,
        'map_embed_url' => '<iframe src="https://evil.com/map"></iframe>',
    ]);

    $action = app(CreateUnitAction::class);
    $unit = $action->execute($data, $admin);

    $this->assertEquals('', $unit->map_embed_url); // Cleared because invalid
});

test('create unit action disables active status for agents', function () {
    $agent = createUser('Agent', 'agent');
    $type = UnitType::firstOrCreate(['name_en' => 'Test Type', 'name_ar' => 'Test Type Ar', 'slug' => 'test-type']);
    $area = Area::firstOrCreate(['name_en' => 'Test Area', 'name_ar' => 'Test Area Ar', 'slug' => 'test-area']);

    $data = CreateUnitData::from([
        'name_en' => 'Test Unit',
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 100,
        'is_active' => true, // Agent tries to activate it
    ]);

    $action = app(CreateUnitAction::class);
    $unit = $action->execute($data, $agent);

    $this->assertFalse((bool) $unit->is_active); // Action enforces false for agents
});
