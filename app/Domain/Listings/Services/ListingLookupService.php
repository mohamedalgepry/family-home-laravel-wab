<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\UnitType;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class ListingLookupService
{
    public const CACHE_KEY_AREAS = 'lookup_areas';

    public const CACHE_KEY_UNIT_TYPES = 'lookup_unit_types';

    public const CACHE_KEY_FEATURES = 'lookup_features';

    public const CACHE_KEY_FINISHING_TYPES = 'lookup_finishing_types';

    public function areas(): Collection
    {
        return Cache::rememberForever(self::CACHE_KEY_AREAS, fn () => Area::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']));
    }

    public function unitTypes(): Collection
    {
        return Cache::rememberForever(self::CACHE_KEY_UNIT_TYPES, fn () => UnitType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']));
    }

    public function features(): Collection
    {
        return Cache::rememberForever(self::CACHE_KEY_FEATURES, fn () => Feature::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));
    }

    public function finishingTypes(): Collection
    {
        return Cache::rememberForever(self::CACHE_KEY_FINISHING_TYPES, fn () => FinishingType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));
    }
}
