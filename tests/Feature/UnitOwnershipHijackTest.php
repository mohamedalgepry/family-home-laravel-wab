<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;

/**
 * Agents must never be able to attribute listings to other users:
 * the store() controller only honors user_id when the caller is admin.
 */
test('agent storing a unit with a foreign user_id gets it forced to their own id', function () {
    $manager = createUser('Hijack Test Manager', 'manager');
    $agent = createUser('Hijack Test Agent', 'agent', $manager->id);
    $victim = createUser('Hijack Victim Admin', 'admin');

    $response = $this->actingAs($agent)->post('/admin/units', [
        'name_ar' => 'وحدة محاولة انتحال',
        'name_en' => 'Hijack Attempt Unit',
        'price' => 1000,
        'transaction' => 'sale',
        'type_id' => UnitType::firstOrCreate(
            ['name_en' => 'Hijack Type', 'name_ar' => 'نوع'],
            ['slug' => 'hijack-type-'.uniqid()]
        )->id,
        'area_id' => Area::firstOrCreate(
            ['name_en' => 'Hijack Area', 'name_ar' => 'منطقة'],
            ['slug' => 'hijack-area-'.uniqid()]
        )->id,
        // Attempt to attribute the unit to the admin
        'user_id' => $victim->id,
    ]);

    $response->assertSessionHasNoErrors();

    $unit = Unit::where('name_en', 'Hijack Attempt Unit')->first();

    expect($unit)->not->toBeNull()
        ->and($unit->user_id)->toBe($agent->id)
        ->and($unit->user_id)->not->toBe($victim->id);
});

test('manager storing a unit with a foreign user_id gets it forced to their own id', function () {
    $manager = createUser('Hijack Test Manager 2', 'manager');
    $victim = createUser('Hijack Victim Agent 2', 'agent');

    $response = $this->actingAs($manager)->post('/admin/units', [
        'name_ar' => 'وحدة مدير منتحل',
        'name_en' => 'Manager Hijack Unit',
        'price' => 2000,
        'transaction' => 'rent',
        'type_id' => UnitType::firstOrCreate(
            ['name_en' => 'Hijack Type 2', 'name_ar' => 'نوع2'],
            ['slug' => 'hijack-type2-'.uniqid()]
        )->id,
        'area_id' => Area::firstOrCreate(
            ['name_en' => 'Hijack Area 2', 'name_ar' => 'منطقة2'],
            ['slug' => 'hijack-area2-'.uniqid()]
        )->id,
        'user_id' => $victim->id,
    ]);

    $response->assertSessionHasNoErrors();

    $unit = Unit::where('name_en', 'Manager Hijack Unit')->first();

    expect($unit)->not->toBeNull()
        ->and($unit->user_id)->toBe($manager->id);
});

test('agent updating a unit cannot flip is_active back on', function () {
    $agent = createUser('IsActive Agent', 'agent');
    $unit = createTestUnit([
        'user_id' => $agent->id,
        'is_active' => false,
    ]);

    $response = $this->actingAs($agent)->put("/admin/units/{$unit->id}", [
        'name_ar' => $unit->name_ar,
        'name_en' => $unit->name_en,
        'price' => $unit->price,
        'transaction' => $unit->transaction,
        'type_id' => $unit->type_id,
        'area_id' => $unit->area_id,
        // Agent attempts to re-activate a deactivated listing
        'is_active' => 1,
    ]);

    $response->assertSessionHasNoErrors();

    expect($unit->fresh()->is_active)->toBeFalse();
});
