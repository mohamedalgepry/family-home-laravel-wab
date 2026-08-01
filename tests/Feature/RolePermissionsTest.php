<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;

beforeEach(function () {
    $this->admin = createUser('Admin User', 'admin', null);
    $this->manager = createUser('Manager User', 'manager', null);
    $this->agent1 = createUser('Agent One', 'agent', null);
    $this->agent2 = createUser('Agent Two', 'agent', null);

    $this->area = Area::create(['name_ar' => 'القاهرة', 'name_en' => 'Cairo']);
    $this->unitType = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment']);
});

test('unauthenticated users are redirected from admin routes', function () {
    $this->get('/admin/projects')->assertRedirect('/login');
    $this->get('/admin/units')->assertRedirect('/login');
});

test('admin can assign and update project user_id', function () {
    $project = Project::create([
        'user_id' => $this->agent1->id,
        'name' => 'Project A',
        'name_ar' => 'مشروع أ',
        'name_en' => 'Project A',
        'slug' => 'project-a',
        'area_id' => $this->area->id,
    ]);

    $this->actingAs($this->admin)
        ->put("/admin/projects/{$project->id}", [
            'name_ar' => 'مشروع أ معدل',
            'name_en' => 'Project A Updated',
            'area_id' => $this->area->id,
            'user_id' => $this->agent2->id,
        ]);

    expect($project->fresh()->user_id)->toBe($this->agent2->id);
});

test('manager cannot change project user_id to another user', function () {
    $project = Project::create([
        'user_id' => $this->manager->id,
        'name' => 'Project B',
        'name_ar' => 'مشروع ب',
        'name_en' => 'Project B',
        'slug' => 'project-b',
        'area_id' => $this->area->id,
    ]);

    $this->actingAs($this->manager)
        ->put("/admin/projects/{$project->id}", [
            'name_ar' => 'مشروع ب معدل',
            'name_en' => 'Project B Updated',
            'area_id' => $this->area->id,
            'user_id' => $this->agent2->id,
        ]);

    expect($project->fresh()->user_id)->toBe($this->manager->id);
});

test('admin can assign and update unit user_id', function () {
    $unit = Unit::create([
        'user_id' => $this->agent1->id,
        'type_id' => $this->unitType->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 1000000,
        'name' => 'Unit 101',
        'name_ar' => 'وحدة 101',
        'name_en' => 'Unit 101',
        'slug' => 'unit-101',
    ]);

    $this->actingAs($this->admin)
        ->put("/admin/units/{$unit->id}", [
            'name_ar' => 'وحدة 101 معدلة',
            'name_en' => 'Unit 101 Updated',
            'type_id' => $this->unitType->id,
            'area_id' => $this->area->id,
            'transaction' => 'sale',
            'price' => 1200000,
            'user_id' => $this->agent2->id,
        ]);

    expect($unit->fresh()->user_id)->toBe($this->agent2->id);
});

test('manager cannot change unit user_id to another user', function () {
    $unit = Unit::create([
        'user_id' => $this->manager->id,
        'type_id' => $this->unitType->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 1000000,
        'name' => 'Unit 102',
        'name_ar' => 'وحدة 102',
        'name_en' => 'Unit 102',
        'slug' => 'unit-102',
    ]);

    $this->actingAs($this->manager)
        ->put("/admin/units/{$unit->id}", [
            'name_ar' => 'وحدة 102 معدلة',
            'name_en' => 'Unit 102 Updated',
            'type_id' => $this->unitType->id,
            'area_id' => $this->area->id,
            'transaction' => 'sale',
            'price' => 1200000,
            'user_id' => $this->agent2->id,
        ]);

    expect($unit->fresh()->user_id)->toBe($this->manager->id);
});
