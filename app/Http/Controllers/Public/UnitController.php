<?php

namespace App\Http\Controllers\Public;

use App\Domain\Common\Services\SeoMetaService;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\ListingLookupService;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\PageViewService;
use Inertia\Inertia;
use Inertia\Response;

class UnitController
{
    private const FILTERABLE = ['area_id', 'type_id', 'transaction', 'price_min', 'price_max', 'size_min', 'size_max', 'search', 'payment_method', 'finishing_type_id', 'features'];

    public function __construct(
        private readonly ListingService $listingService,
        private readonly ListingLookupService $lookupService,
        private readonly PageViewService $pageViewService,
        private readonly SeoMetaService $seoMetaService,
    ) {}

    public function index(): Response
    {
        $filters = request()->only(self::FILTERABLE);

        $units = $this->listingService->getUnitsByFilters($filters);

        return Inertia::render('Public/Units/Index', [
            'units' => $units,
            'filters' => $filters,
            'areas' => $this->lookupService->areas(),
            'unitTypes' => $this->lookupService->unitTypes(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ]);
    }

    public function deals(): Response
    {
        $filters = array_merge(
            request()->only(self::FILTERABLE),
            ['is_deal' => true]
        );

        $units = $this->listingService->getUnitsByFilters($filters);

        return Inertia::render('Public/Units/Deals', [
            'units' => $units,
            'filters' => $filters,
            'areas' => $this->lookupService->areas(),
            'unitTypes' => $this->lookupService->unitTypes(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ]);
    }

    public function show(string $slug): Response
    {
        $unit = $this->listingService->getUnitBySlug($slug);

        if (! $unit || ! $unit->is_active) {
            abort(404);
        }

        $this->pageViewService->recordView(
            Unit::class,
            $unit->id,
            request()->ip(),
            request()->userAgent(),
        );

        $similarUnits = $this->listingService->getSimilarUnits($unit);

        $meta = $this->seoMetaService->forListing($unit, 'units');

        return Inertia::render('Public/Units/Show', [
            'unit' => $unit,
            'similarUnits' => $similarUnits,
        ])->withViewData(['meta' => $meta]);
    }
}
