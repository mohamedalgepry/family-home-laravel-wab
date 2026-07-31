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

it('returns the lookup collections and caches them', function () {
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $feature = Feature::create(['name_ar' => 'ميزة', 'name_en' => 'Feature']);
    $finishing = FinishingType::create(['name_ar' => 'تشطيب', 'name_en' => 'Finishing']);

    $areas = $this->service->areas();
    $unitTypes = $this->service->unitTypes();
    $features = $this->service->features();
    $finishingTypes = $this->service->finishingTypes();

    expect($areas)->toHaveCount(1)->first()->id->toBe($area->id)
        ->and($unitTypes)->toHaveCount(1)->first()->id->toBe($type->id)
        ->and($features)->toHaveCount(1)->first()->id->toBe($feature->id)
        ->and($finishingTypes)->toHaveCount(1)->first()->id->toBe($finishing->id)
        ->and(Cache::has(ListingLookupService::CACHE_KEY_AREAS))->toBeTrue()
        ->and(Cache::has(ListingLookupService::CACHE_KEY_UNIT_TYPES))->toBeTrue()
        ->and(Cache::has(ListingLookupService::CACHE_KEY_FEATURES))->toBeTrue()
        ->and(Cache::has(ListingLookupService::CACHE_KEY_FINISHING_TYPES))->toBeTrue();
});

it('serves repeated calls from the cache without querying the database again', function () {
    Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
    $this->service->areas();

    DB::enableQueryLog();
    $this->service->areas();
    $queries = collect(DB::getQueryLog());

    expect($queries->where('query', 'like', 'select %from "areas"%')->count())->toBe(0);
});

it('refreshes the cached lookups when a lookup model changes', function () {
    Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);
    $this->service->areas();

    Area::create(['name_ar' => 'منطقة ثانية', 'name_en' => 'Second Area']);

    expect($this->service->areas())->toHaveCount(2);
});
