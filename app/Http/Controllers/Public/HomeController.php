<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\SearchService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController
{
    private const CACHE_TTL = 3600;

    public function __construct(
        private readonly ListingService $listingService,
        private readonly SearchService $searchService,
    ) {}

    public function __invoke(): Response
    {
        $featuredUnits = $this->listingService->getFeaturedUnits(8);
        $latestUnits = $this->listingService->getLatestUnits(12);
        $popularSearches = $this->searchService->getPopularSearches();

        $areas = Cache::remember('listing_areas', self::CACHE_TTL, function () {
            return Area::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']);
        });

        $unitTypes = Cache::remember('listing_unit_types', self::CACHE_TTL, function () {
            return UnitType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']);
        });

        $features = Cache::remember('listing_features', self::CACHE_TTL, function () {
            return Feature::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']);
        });

        $finishingTypes = Cache::remember('listing_finishing_types', self::CACHE_TTL, function () {
            return FinishingType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']);
        });

        return Inertia::render('Public/Home', [
            'featuredUnits' => $featuredUnits,
            'latestUnits' => $latestUnits,
            'popularSearches' => $popularSearches,
            'areas' => $areas,
            'unitTypes' => $unitTypes,
            'features' => $features,
            'finishingTypes' => $finishingTypes,
        ]);
    }
}
