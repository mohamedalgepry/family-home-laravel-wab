<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Users\Models\User;

beforeEach(function () {
    $this->service = app(ListingService::class);

    $this->user = new User(['name' => 'Owner', 'email' => 'owner@test.com', 'password' => 'x']);
    $this->user->role = 'agent';
    $this->user->save();

    $this->type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment']);
    $this->otherType = UnitType::create(['name_ar' => 'فيلا', 'name_en' => 'Villa']);
    $this->area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    $this->unit = createUnit('nile-villa', ['type_id' => $this->type->id]);
});

function createUnit(string $slug, array $overrides = []): Unit
{
    return createTestUnit(array_merge([
        'user_id' => test()->user->id,
        'type_id' => test()->type->id,
        'area_id' => test()->area->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Nile-villa',
        'name_ar' => 'Nile-villa',
        'name_en' => 'Nile-villa',
        'slug' => $slug,
        'slug_ar' => $slug,
        'slug_en' => $slug,
        'is_active' => true,
    ], $overrides));
}

it('finds units by any of the three slugs', function () {
    expect(Unit::byAnySlug('nile-villa')->first()?->id)->toBe($this->unit->id)
        ->and(Unit::byAnySlug($this->unit->slug_ar)->first()?->id)->toBe($this->unit->id)
        ->and(Unit::byAnySlug($this->unit->slug_en)->first()?->id)->toBe($this->unit->id);
});

it('finds projects by any of the three slugs', function () {
    $project = new Project([
        'user_id' => $this->user->id,
        'name' => 'Project',
        'name_ar' => 'مشروع',
        'name_en' => 'Project',
        'slug' => 'nile-project',
    ]);
    $project->save();

    expect(Project::byAnySlug('nile-project')->first()?->id)->toBe($project->id)
        ->and(Project::byAnySlug($project->slug_ar)->first()?->id)->toBe($project->id)
        ->and(Project::byAnySlug($project->slug_en)->first()?->id)->toBe($project->id);
});

it('returns null from getUnitBySlug when the slug is unknown', function () {
    expect($this->service->getUnitBySlug('missing-slug'))->toBeNull();
});

it('filters units by transaction', function () {
    createUnit('rent-unit', ['transaction' => 'rent']);

    $rent = $this->service->getUnitsByFilters(['transaction' => 'rent'], 10);
    $sale = $this->service->getUnitsByFilters(['transaction' => 'sale'], 10);

    expect($rent->pluck('id')->all())->toHaveCount(1)
        ->and($rent->first()->transaction)->toBe('rent')
        ->and($sale->pluck('id')->all())->toHaveCount(1)
        ->and($sale->first()->transaction)->toBe('sale');
});

it('returns only similar units excluding the current one', function () {
    createUnit('same-type-a', ['type_id' => $this->type->id]);
    createUnit('same-type-b', ['type_id' => $this->type->id]);

    $otherArea = Area::create(['name_ar' => 'منطقة أخرى', 'name_en' => 'Other Area']);
    createUnit('other-type', ['type_id' => $this->otherType->id, 'area_id' => $otherArea->id]);

    $similar = $this->service->getSimilarUnits($this->unit, 10);

    expect($similar->pluck('id')->all())->toHaveCount(2)
        ->and($similar->pluck('id')->all())->not->toContain($this->unit->id);
});

it('orders featured units by priority, pin, then newest', function () {
    createUnit('low-priority', ['priority_points' => 1]);
    createUnit('high-priority', ['priority_points' => 100]);
    createUnit('pinned-new', ['priority_points' => 10, 'is_pinned' => true]);

    $units = $this->service->getUnitsByFilters([], 10);

    expect($units->pluck('slug')->all())->toBe(['high-priority', 'pinned-new', 'low-priority', 'nile-villa']);
});

it('skips inactive units', function () {
    createUnit('hidden-unit', ['is_active' => false]);

    $units = $this->service->getUnitsByFilters([], 10);

    expect($units->pluck('slug')->all())->not->toContain('hidden-unit');
});

it('keeps slugs unique when names collide', function () {
    createUnit('first-copy', ['name' => 'first-copy', 'name_en' => 'first-copy']);
    $second = createUnit('first-copy', ['name' => 'first-copy', 'name_en' => 'first-copy', 'slug' => null]);

    expect($second->slug)->toBe('first-copy-1')
        ->and(Unit::where('slug', 'like', 'first-copy%')->count())->toBe(2);
});
