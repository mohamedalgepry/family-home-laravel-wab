<?php

use App\Domain\Listings\Actions\UpdateUnitAction;
use App\Domain\Listings\DTOs\CreateUnitData;

test('update unit action explicitely sets is_active and user_id', function () {
    $admin = createUser('Admin', 'admin');
    $anotherUser = createUser('Another User', 'admin');
    $unit = createTestUnit([
        'user_id' => $admin->id,
        'is_active' => false,
    ]);

    $data = CreateUnitData::from([
        'name_en' => 'Test Unit Updated',
        'type_id' => $unit->type_id,
        'area_id' => $unit->area_id,
        'transaction' => 'sale',
        'price' => 100,
        'is_active' => true,
        'user_id' => $anotherUser->id,
    ]);

    $action = app(UpdateUnitAction::class);
    $action->execute($unit->id, $data, $admin);

    $unit->refresh();

    $this->assertTrue((bool) $unit->is_active);
    $this->assertEquals($anotherUser->id, $unit->user_id);
    $this->assertEquals('Test Unit Updated', $unit->name);
});

test('update unit action clears invalid map embed urls', function () {
    $admin = createUser('Admin', 'admin');
    $unit = createTestUnit([
        'user_id' => $admin->id,
        'map_embed_url' => 'https://maps.google.com/valid',
    ]);

    $data = CreateUnitData::from([
        'name_en' => 'Test Unit Updated',
        'type_id' => $unit->type_id,
        'area_id' => $unit->area_id,
        'transaction' => 'sale',
        'price' => 100,
        'map_embed_url' => 'https://evil.com/map',
    ]);

    $action = app(UpdateUnitAction::class);
    $action->execute($unit->id, $data, $admin);

    $unit->refresh();

    $this->assertEquals('', $unit->map_embed_url); // Cleared because invalid
});

test('update unit action ignores is_active for agents', function () {
    $agent = createUser('Agent', 'agent');
    $unit = createTestUnit([
        'user_id' => $agent->id,
        'is_active' => false,
    ]);

    $data = CreateUnitData::from([
        'name_en' => 'Test Unit Updated',
        'type_id' => $unit->type_id,
        'area_id' => $unit->area_id,
        'transaction' => 'sale',
        'price' => 100,
        'is_active' => true, // Agent tries to activate
    ]);

    $action = app(UpdateUnitAction::class);
    $action->execute($unit->id, $data, $agent);

    $unit->refresh();

    $this->assertFalse((bool) $unit->is_active); // Action unset is_active for agents
});
