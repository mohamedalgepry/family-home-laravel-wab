<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Services\ListingLookupService;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\SearchService;
use App\Services\SeoService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController
{
    public function __construct(
        private readonly ListingService $listingService,
        private readonly ListingLookupService $lookupService,
        private readonly SearchService $searchService,
        private readonly SeoService $seoService,
    ) {}

    public function __invoke(): Response
    {
        $page = (int) request()->input('page', 1);
        $version = Cache::get(ListingService::CACHE_VERSION_KEY, 1);

        $homeData = Cache::remember(
            "home_page_data_page_{$page}_v{$version}",
            300,
            function () {
                return [
                    'featuredUnits' => $this->listingService->getFeaturedUnits(8),
                    'latestUnits' => $this->listingService->getLatestUnits(12),
                    'latestProjects' => $this->listingService->getLatestProjects(8),
                    'popularSearches' => $this->searchService->getPopularSearches(),
                    'areas' => $this->lookupService->areas(),
                    'unitTypes' => $this->lookupService->unitTypes(),
                    'features' => $this->lookupService->features(),
                    'finishingTypes' => $this->lookupService->finishingTypes(),
                ];
            }
        );

        $meta = $this->seoService->forPage('home');

        return Inertia::render('Public/Home', $homeData)
            ->withViewData(['meta' => $meta]);
    }
}
