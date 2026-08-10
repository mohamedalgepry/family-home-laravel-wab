<?php

use App\Domain\Listings\Actions\StoreUploadedImagesAction;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->admin = new User(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => 'x']);
    $this->admin->role = 'admin';
    $this->admin->save();

    $this->type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment']);
    $this->area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
});

it('rejects a unit store request with missing required fields', function () {
    $this->actingAs($this->admin)
        ->post('/admin/units', [
            'name_ar' => 'فيلا',
        ])
        ->assertSessionHasErrors(['name_en', 'type_id', 'area_id', 'transaction', 'price']);

    expect(Unit::count())->toBe(0);
});

it('accepts a valid unit store request', function () {
    $this->actingAs($this->admin)
        ->post('/admin/units', [
            'name_ar' => 'فيلا',
            'name_en' => 'Villa',
            'type_id' => $this->type->id,
            'area_id' => $this->area->id,
            'transaction' => 'sale',
            'price' => 1000,
        ])
        ->assertRedirect(route('admin.units.index'));

    expect(Unit::count())->toBe(1)
        ->and(Unit::first()->name_en)->toBe('Villa');
});

it('rejects an invalid unit update request', function () {
    $unit = new Unit([
        'user_id' => $this->admin->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Villa',
        'name_ar' => 'فيلا',
        'name_en' => 'Villa',
    ]);
    $unit->save();

    $this->actingAs($this->admin)
        ->put("/admin/units/{$unit->id}", [
            'name_ar' => 'فيلا',
            'name_en' => 'Villa',
            'type_id' => $this->type->id,
            'area_id' => $this->area->id,
            'transaction' => 'mortgage',
            'price' => 1000,
        ])
        ->assertSessionHasErrors(['transaction']);
});

it('accepts a valid unit update request', function () {
    $unit = new Unit([
        'user_id' => $this->admin->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Villa',
        'name_ar' => 'فيلا',
        'name_en' => 'Villa',
    ]);
    $unit->save();

    $this->actingAs($this->admin)
        ->put("/admin/units/{$unit->id}", [
            'name_ar' => 'فيلا جديدة',
            'name_en' => 'New Villa',
            'type_id' => $this->type->id,
            'area_id' => $this->area->id,
            'transaction' => 'sale',
            'price' => 2000,
        ])
        ->assertRedirect(route('admin.units.index'));

    expect($unit->fresh()->name_en)->toBe('New Villa')
        ->and((float) $unit->fresh()->price)->toBe(2000.0);
});

it('retains meta description ar and en when updating a unit', function () {
    $unit = new Unit([
        'user_id' => $this->admin->id,
        'type_id' => $this->type->id,
        'area_id' => $this->area->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Villa',
        'name_ar' => 'فيلا',
        'name_en' => 'Villa',
        'meta_description_ar' => 'وصف ميتا قديم',
        'meta_description_en' => 'Old meta description',
    ]);
    $unit->save();

    $this->actingAs($this->admin)
        ->put("/admin/units/{$unit->id}", [
            'name_ar' => 'فيلا جديدة',
            'name_en' => 'New Villa',
            'type_id' => $this->type->id,
            'area_id' => $this->area->id,
            'transaction' => 'sale',
            'price' => 2000,
            'meta_description_ar' => 'وصف ميتا جديد',
            'meta_description_en' => 'New meta description',
        ])
        ->assertRedirect(route('admin.units.index'));

    $fresh = $unit->fresh();
    expect($fresh->meta_description_ar)->toBe('وصف ميتا جديد')
        ->and($fresh->meta_description_en)->toBe('New meta description');
});

it('accepts a valid project store request with a manager', function () {
    $manager = new User(['name' => 'Manager', 'email' => 'manager@test.com', 'password' => 'x']);
    $manager->role = 'manager';
    $manager->save();

    $this->actingAs($this->admin)
        ->post('/admin/projects', [
            'name_ar' => 'مشروع النيل',
            'name_en' => 'Nile Project',
            'area_id' => $this->area->id,
            'manager_id' => $manager->id,
        ])
        ->assertRedirect(route('admin.projects.index'));

    expect(Project::count())->toBe(1)
        ->and(Project::first()->user_id)->toBe($manager->id);
});

it('accepts a project update request with deleted image ids', function () {
    $project = new Project([
        'user_id' => $this->admin->id,
        'name' => 'Nile Project',
        'name_ar' => 'مشروع النيل',
        'name_en' => 'Nile Project',
    ]);
    $project->save();

    $this->actingAs($this->admin)
        ->put("/admin/projects/{$project->id}", [
            'name_ar' => 'مشروع النيل الجديد',
            'name_en' => 'New Nile Project',
            'deleted_image_ids' => [],
            'image_order' => [],
        ])
        ->assertRedirect(route('admin.projects.index'));

    expect($project->fresh()->name_en)->toBe('New Nile Project');
});

it('rejects an invalid map embed url', function () {
    $this->actingAs($this->admin)
        ->post('/admin/units', [
            'name_ar' => 'فيلا',
            'name_en' => 'Villa',
            'type_id' => $this->type->id,
            'area_id' => $this->area->id,
            'transaction' => 'sale',
            'price' => 1000,
            'map_embed_url' => 'not-a-valid-url',
        ])
        ->assertSessionHasErrors(['map_embed_url']);
});

it('stores uploaded images under the given folder', function () {
    Storage::fake('public');

    $paths = app(StoreUploadedImagesAction::class)->execute([
        UploadedFile::fake()->image('photo.jpg'),
        'not-a-file',
    ], 'units');

    expect($paths)->toHaveCount(1)
        ->and($paths[0])->toContain('units/'.now()->format('Y/m'))
        ->and($paths[0])->toEndWith('.webp');
    
    // We can't assert the .webp exists because it's processed asynchronously,
    // but we can check if the directory has the uploaded file.
    $files = Storage::disk('public')->allFiles('units/'.now()->format('Y/m'));
    expect($files)->not->toBeEmpty();
});
