<?php

namespace App\Observers;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\ListingLookupService;
use Illuminate\Support\Facades\Cache;

class LookupObserver
{
    private function clearLookupCache($model): void
    {
        if ($model instanceof Area) {
            Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        } elseif ($model instanceof UnitType) {
            Cache::forget(ListingLookupService::CACHE_KEY_UNIT_TYPES);
        } elseif ($model instanceof Feature) {
            Cache::forget(ListingLookupService::CACHE_KEY_FEATURES);
        } elseif ($model instanceof FinishingType) {
            Cache::forget(ListingLookupService::CACHE_KEY_FINISHING_TYPES);
        }
    }

    public function created($model): void
    {
        $this->clearLookupCache($model);
    }

    public function updated($model): void
    {
        $this->clearLookupCache($model);
    }

    public function deleted($model): void
    {
        $this->clearLookupCache($model);
    }

    public function restored($model): void
    {
        $this->clearLookupCache($model);
    }

    public function forceDeleted($model): void
    {
        $this->clearLookupCache($model);
    }
}
