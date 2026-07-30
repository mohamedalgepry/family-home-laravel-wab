<?php

namespace App\Observers;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\UnitType;
use Illuminate\Support\Facades\Cache;

class LookupObserver
{
    private function clearLookupCache($model): void
    {
        if ($model instanceof Area) {
            Cache::forget('lookup_areas');
        } elseif ($model instanceof UnitType) {
            Cache::forget('lookup_unit_types');
        } elseif ($model instanceof Feature) {
            Cache::forget('lookup_features');
        } elseif ($model instanceof FinishingType) {
            Cache::forget('lookup_finishing_types');
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
