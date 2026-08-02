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
        $meta = $this->buildFilteredUnitsMeta($filters);

        return Inertia::render('Public/Units/Index', [
            'units' => $units,
            'filters' => $filters,
            'areas' => $this->lookupService->areas(),
            'unitTypes' => $this->lookupService->unitTypes(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ])->withViewData(['meta' => $meta]);
    }

    public function deals(): Response
    {
        $filters = array_merge(
            request()->only(self::FILTERABLE),
            ['is_deal' => true]
        );

        $units = $this->listingService->getUnitsByFilters($filters);
        $meta = $this->buildFilteredUnitsMeta($filters, true);

        return Inertia::render('Public/Units/Deals', [
            'units' => $units,
            'filters' => $filters,
            'areas' => $this->lookupService->areas(),
            'unitTypes' => $this->lookupService->unitTypes(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ])->withViewData(['meta' => $meta]);
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

    private function buildFilteredUnitsMeta(array $filters, bool $isDeals = false): array
    {
        $customMeta = [];
        $parts = [];

        if (! empty($filters['type_id'])) {
            $types = $this->lookupService->unitTypes();
            $type = collect($types)->firstWhere('id', (int) $filters['type_id']);
            if ($type) {
                $parts[] = app()->getLocale() === 'ar' ? ($type->name_ar ?? $type->name) : ($type->name_en ?? $type->name);
            }
        }

        if (! empty($filters['area_id'])) {
            $areas = $this->lookupService->areas();
            $area = collect($areas)->firstWhere('id', (int) $filters['area_id']);
            if ($area) {
                $areaName = app()->getLocale() === 'ar' ? ($area->name_ar ?? $area->name) : ($area->name_en ?? $area->name);
                $parts[] = (app()->getLocale() === 'ar' ? 'في ' : 'in ').$areaName;
            }
        }

        if (! empty($filters['search'])) {
            $parts[] = $filters['search'];
        }

        if (! empty($parts)) {
            $prefix = $isDeals
                ? (app()->getLocale() === 'ar' ? 'عروض شقق وعقارات ' : 'Property Deals ')
                : (app()->getLocale() === 'ar' ? 'وحدات وعقارات للبيع ' : 'Properties for sale ');
            $customMeta['title'] = $prefix.implode(' ', $parts).' - '.config('app.name');
            $customMeta['description'] = (app()->getLocale() === 'ar' ? 'تصفح ' : 'Browse ').$prefix.implode(' ', $parts).' '.(app()->getLocale() === 'ar' ? 'بأفضل الأسعار والتسهيلات من فاميلي هوم' : 'with best prices from Family Home');
        }

        $pageKey = $isDeals ? 'deals' : 'units_index';
        return app(\App\Services\SeoService::class)->forPage($pageKey, $customMeta);
    }
}
