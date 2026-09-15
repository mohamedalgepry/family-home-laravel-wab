<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;

beforeEach(function () {
    $this->admin = createUser('Admin User', 'admin');
    $this->manager = createUser('Manager User', 'manager');
    $this->agent = createUser('Agent User', 'agent', $this->manager->id);

    $area = Area::firstOrCreate(['slug' => 'test-area'], ['name_ar' => 'منطقة', 'name_en' => 'Area']);
    $type = UnitType::firstOrCreate(['slug' => 'test-type'], ['name_ar' => 'نوع', 'name_en' => 'Type']);

    $this->unit = createTestUnit([
        'user_id' => $this->admin->id,
        'area_id' => $area->id,
        'type_id' => $type->id,
        'is_active' => true,
        'is_deal' => false,
        'is_pinned' => false,
    ]);

    $this->project = Project::create([
        'user_id' => $this->admin->id,
        'area_id' => $area->id,
        'name' => 'Test Project',
        'name_ar' => 'مشروع تجريبي',
        'name_en' => 'Test Project',
        'slug' => 'test-project',
        'is_active' => true,
    ]);
});

test('admin can toggle unit active in background via JSON', function () {
    $response = $this->actingAs($this->admin)->postJson(route('admin.units.toggle-active', $this->unit));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'is_active' => false,
        ]);

    expect($this->unit->fresh()->is_active)->toBeFalse();
});

test('admin can toggle unit deal in background via JSON', function () {
    $response = $this->actingAs($this->admin)->postJson(route('admin.units.toggle-deal', $this->unit));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'is_deal' => true,
        ]);

    expect($this->unit->fresh()->is_deal)->toBeTrue();
});

test('admin can toggle unit pin in background via JSON', function () {
    $response = $this->actingAs($this->admin)->postJson(route('admin.units.toggle-pin', $this->unit));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'is_pinned' => true,
        ]);

    expect($this->unit->fresh()->is_pinned)->toBeTrue();
});

test('admin can toggle project active in background via JSON', function () {
    $response = $this->actingAs($this->admin)->postJson(route('admin.projects.toggle-active', $this->project));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'is_active' => false,
        ]);

    expect($this->project->fresh()->is_active)->toBeFalse();
});

test('manager can toggle active on their own project via JSON', function () {
    $managerProject = Project::create([
        'user_id' => $this->manager->id,
        'name' => 'Manager Project',
        'name_ar' => 'مشروع مدير',
        'name_en' => 'Manager Project',
        'slug' => 'manager-project',
        'is_active' => false,
    ]);

    $response = $this->actingAs($this->manager)->postJson(route('admin.projects.toggle-active', $managerProject));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'is_active' => true,
        ]);

    expect($managerProject->fresh()->is_active)->toBeTrue();
});

test('agent cannot toggle project active', function () {
    $response = $this->actingAs($this->agent)->postJson(route('admin.projects.toggle-active', $this->project));

    $response->assertForbidden();
});
