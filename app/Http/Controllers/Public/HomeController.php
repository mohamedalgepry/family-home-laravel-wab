<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Services\ListingLookupService;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\SearchService;
use App\Http\Resources\Public\AreaPublicResource;
use App\Http\Resources\Public\ProjectPublicResource;
use App\Http\Resources\Public\UnitPublicResource;
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
        $featuredPage = (int) request()->input('featured_page', 1);
        $latestUnitsPage = (int) request()->input('latest_units_page', 1);
        $latestProjectsPage = (int) request()->input('latest_projects_page', 1);
        $version = 1;
        try {
            $version = Cache::get(ListingService::CACHE_VERSION_KEY, 1);
        } catch (\Throwable $e) {
        }

        try {
            $homeData = Cache::remember(
                "home_page_data_f{$featuredPage}_u{$latestUnitsPage}_p{$latestProjectsPage}_v{$version}",
                300,
                function () {
                    return [
                        'featuredUnits' => $this->listingService->getFeaturedUnits(8, 'featured_page'),
                        'latestUnits' => $this->listingService->getLatestUnits(12, 'latest_units_page'),
                        'latestProjects' => $this->listingService->getLatestProjects(8, 'latest_projects_page'),
                        'popularSearches' => $this->searchService->getPopularSearches(),
                        'areas' => $this->lookupService->areas(),
                        'unitTypes' => $this->lookupService->unitTypes(),
                        'features' => $this->lookupService->features(),
                        'finishingTypes' => $this->lookupService->finishingTypes(),
                    ];
                }
            );
        } catch (\Throwable $e) {
            $homeData = [
                'featuredUnits' => new \Illuminate\Pagination\LengthAwarePaginator([], 0, 8),
                'latestUnits' => new \Illuminate\Pagination\LengthAwarePaginator([], 0, 12),
                'latestProjects' => new \Illuminate\Pagination\LengthAwarePaginator([], 0, 8),
                'popularSearches' => [],
                'areas' => [],
                'unitTypes' => [],
                'features' => [],
                'finishingTypes' => [],
            ];
        }

        $homeData['featuredUnits'] = UnitPublicResource::collection($homeData['featuredUnits']);
        $homeData['latestUnits'] = UnitPublicResource::collection($homeData['latestUnits']);
        $homeData['latestProjects'] = ProjectPublicResource::collection($homeData['latestProjects']);
        $homeData['areas'] = AreaPublicResource::collection($homeData['areas'])->resolve();

        $meta = $this->seoService->forPage('home');

        return Inertia::render('Public/Home', $homeData)
            ->withViewData(['meta' => $meta]);
    }
}
