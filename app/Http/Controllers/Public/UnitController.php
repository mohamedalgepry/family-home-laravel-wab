<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\PageViewService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class UnitController
{
    public function __construct(
        private readonly ListingService $listingService,
        private readonly PageViewService $pageViewService,
    ) {}

    public function index(): Response
    {
        $filters = request()->only(['area_id', 'type_id', 'transaction', 'price_min', 'price_max', 'size_min', 'size_max', 'search', 'payment_method', 'finishing_type_id', 'features']);

        $units = $this->listingService->getUnitsByFilters($filters);
        $areas = Cache::rememberForever('lookup_areas', fn () => Area::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']));
        $unitTypes = Cache::rememberForever('lookup_unit_types', fn () => UnitType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']));
        $features = Cache::rememberForever('lookup_features', fn () => Feature::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));
        $finishingTypes = Cache::rememberForever('lookup_finishing_types', fn () => FinishingType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));

        return Inertia::render('Public/Units/Index', [
            'units' => $units,
            'filters' => $filters,
            'areas' => $areas,
            'unitTypes' => $unitTypes,
            'features' => $features,
            'finishingTypes' => $finishingTypes,
        ]);
    }

    public function deals(): Response
    {
        $filters = array_merge(
            request()->only(['area_id', 'type_id', 'transaction', 'price_min', 'price_max', 'size_min', 'size_max', 'search', 'payment_method', 'finishing_type_id', 'features']),
            ['is_deal' => true]
        );

        $units = $this->listingService->getUnitsByFilters($filters);
        $areas = Cache::rememberForever('lookup_areas', fn () => Area::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']));
        $unitTypes = Cache::rememberForever('lookup_unit_types', fn () => UnitType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']));
        $features = Cache::rememberForever('lookup_features', fn () => Feature::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));
        $finishingTypes = Cache::rememberForever('lookup_finishing_types', fn () => FinishingType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));

        return Inertia::render('Public/Units/Deals', [
            'units' => $units,
            'filters' => $filters,
            'areas' => $areas,
            'unitTypes' => $unitTypes,
            'features' => $features,
            'finishingTypes' => $finishingTypes,
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

        $locale = app()->getLocale();
        $slug = "slug_{$locale}";
        $currentSlug = $unit->$slug ?? $unit->slug;
        $arSlug = $unit->slug_ar ?? $unit->slug;
        $enSlug = $unit->slug_en ?? $unit->slug;

        $meta = [
            'title' => $unit->name.' - '.config('app.name'),
            'description' => str($unit->meta_description ?? $unit->description)->stripTags()->limit(150),
            'image' => $unit->images?->firstWhere('is_primary', true)?->path ?? $unit->images?->first()?->path,
            'canonical' => url("/{$locale}/units/{$currentSlug}"),
            'hreflang' => [
                'ar' => url("/ar/units/{$arSlug}"),
                'en' => url("/en/units/{$enSlug}"),
                'x-default' => url("/ar/units/{$arSlug}"),
            ],
            'schema' => '<script type="application/ld+json">'.json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'RealEstateListing',
                'name' => $unit->name,
                'description' => str($unit->meta_description ?? $unit->description)->stripTags()->limit(150),
                'image' => $unit->images?->firstWhere('is_primary', true) ? asset('storage/'.$unit->images->firstWhere('is_primary', true)->path) : '',
                'offers' => [
                    '@type' => 'Offer',
                    'price' => $unit->price,
                    'priceCurrency' => 'EGP',
                ],
            ], JSON_UNESCAPED_UNICODE).'</script>',
        ];

        return Inertia::render('Public/Units/Show', [
            'unit' => $unit,
            'similarUnits' => $similarUnits,
        ])->withViewData(['meta' => $meta]);
    }
}
