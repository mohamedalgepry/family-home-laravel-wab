<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Services\ListingLookupService;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\SearchService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController
{
    public function __construct(
        private readonly ListingService $listingService,
        private readonly ListingLookupService $lookupService,
        private readonly SearchService $searchService,
    ) {}

    public function __invoke(): Response
    {
        $featuredUnits = $this->listingService->getFeaturedUnits(8);
        $latestUnits = $this->listingService->getLatestUnits(12);
        $popularSearches = $this->searchService->getPopularSearches();

        return Inertia::render('Public/Home', [
            'featuredUnits' => $featuredUnits,
            'latestUnits' => $latestUnits,
            'popularSearches' => $popularSearches,
            'areas' => $this->lookupService->areas(),
            'unitTypes' => $this->lookupService->unitTypes(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ]);
    }
}
