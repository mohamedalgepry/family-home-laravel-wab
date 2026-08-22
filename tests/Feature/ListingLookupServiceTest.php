<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\ListingLookupService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    Cache::flush();

    $this->service = app(ListingLookupService::class);
});

// Matches the areas SELECT on any driver: `areas`, "areas", or bare areas.
function areasQueryPattern(): string
{
    return '/\bfrom\s+[`"]?areas[`"]?\b/i';
}

it('returns the lookup collections including newly created records and caches them', function () {
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $feature = Feature::create(['name_ar' => 'ميزة', 'name_en' => 'Feature']);
    $finishing = FinishingType::create(['name_ar' => 'تشطيب', 'name_en' => 'Finishing']);

    $areas = $this->service->areas();
    $unitTypes = $this->service->unitTypes();
    $features = $this->service->features();
    $finishingTypes = $this->service->finishingTypes();

    // Seed-agnostic: the lookup tables may already contain seeded rows.
    // We assert OUR records are present and cached, not exact totals.
    expect($areas->pluck('id'))->toContain($area->id)
        ->and($unitTypes->pluck('id'))->toContain($type->id)
        ->and($features->pluck('id'))->toContain($feature->id)
        ->and($finishingTypes->pluck('id'))->toContain($finishing->id)
        ->and(Cache::has(ListingLookupService::CACHE_KEY_AREAS))->toBeTrue()
        ->and(Cache::has(ListingLookupService::CACHE_KEY_UNIT_TYPES))->toBeTrue()
        ->and(Cache::has(ListingLookupService::CACHE_KEY_FEATURES))->toBeTrue()
        ->and(Cache::has(ListingLookupService::CACHE_KEY_FINISHING_TYPES))->toBeTrue();
});

it('serves repeated calls from the cache without querying the database again', function () {
    Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    // Positive control: prove our query matcher actually detects an
    // areas SELECT. Without this, the zero-query assertion below would
    // be vacuous (passing even if the cache were broken).
    DB::enableQueryLog();
    $this->service->areas();

    // Flush only the areas cache key to force a real DB round-trip.
    Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
    $this->service->areas();

    $queries = collect(DB::getQueryLog());
    expect($queries->filter(fn ($q) => preg_match(areasQueryPattern(), $q['query']))->count())->toBeGreaterThan(0);

    // Now the real assertion: a second call must NOT touch the database.
    DB::flushQueryLog();
    $this->service->areas();
    $queriesAfter = collect(DB::getQueryLog());

    expect($queriesAfter->filter(fn ($q) => preg_match(areasQueryPattern(), $q['query']))->count())->toBe(0);
});

it('refreshes the cached lookups when a lookup model changes', function () {
    Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
    $cached = $this->service->areas();

    $second = Area::create(['name_ar' => 'منطقة ثانية', 'name_en' => 'Second Area']);

    $fresh = $this->service->areas();

    // Seed-agnostic: the refreshed collection must contain BOTH the
    // previously cached record and the one created after caching.
    expect($fresh->count())->toBeGreaterThanOrEqual($cached->count() + 1)
        ->and($fresh->pluck('id'))->toContain($second->id);
});
