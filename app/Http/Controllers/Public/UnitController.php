<?php

namespace App\Http\Controllers\Public;

use App\Domain\Common\Services\SeoMetaService;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\ListingLookupService;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\PageViewService;
use App\Domain\Listings\Services\SearchService;
use App\Http\Resources\Public\ArticlePublicResource;
use App\Http\Resources\Public\ProjectPublicResource;
use App\Http\Resources\Public\UnitPublicResource;
use App\Services\SeoService;
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

    public function index(SearchService $searchService, \App\Domain\Listings\Services\FilterResolver $filterResolver): Response
    {
        $filters = request()->only(self::FILTERABLE);

        if (! empty($filters['search'])) {
            $searchService->recordSearch($filters['search']);
        }

        $filters = $filterResolver->resolve($filters);

        $units = $this->listingService->getUnitsByFilters($filters);
        $meta = $this->buildFilteredUnitsMeta($filters);

        return Inertia::render('Public/Units/Index', [
            'units' => UnitPublicResource::collection($units),
            'filters' => $filters,
            'seo_meta' => $meta,
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
            'units' => UnitPublicResource::collection($units),
            'filters' => $filters,
            'seo_meta' => $meta,
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

        $relatedArticles = Article::where('is_published', true)
            ->with(['images', 'category'])
            ->orderByDesc('published_at')
            ->limit(4)
            ->get();

        $relatedProjects = Project::where('is_active', true)
            ->when($unit->project_id, fn ($q) => $q->where('id', '!=', $unit->project_id))
            ->when($unit->area_id, fn ($q) => $q->where('area_id', $unit->area_id))
            ->with(['area', 'images', 'user.profile'])
            ->withCount(['units' => fn ($q) => $q->active()])
            ->orderByDesc('created_at')
            ->limit(4)
            ->get();

        if ($relatedProjects->count() < 4) {
            $fallbackProjects = Project::where('is_active', true)
                ->when($unit->project_id, fn ($q) => $q->where('id', '!=', $unit->project_id))
                ->whereNotIn('id', $relatedProjects->pluck('id'))
                ->with(['area', 'images', 'user.profile'])
                ->withCount(['units' => fn ($q) => $q->active()])
                ->orderByDesc('created_at')
                ->limit(4 - $relatedProjects->count())
                ->get();
            $relatedProjects = $relatedProjects->concat($fallbackProjects);
        }

        $meta = $this->seoMetaService->forListing($unit, 'units');

        $mainImage = $unit->images->firstWhere('is_primary', true)
            ?? $unit->images->first();

        $lcpImage = $mainImage ? $mainImage->url : null;

        return Inertia::render('Public/Units/Show', [
            'unit' => UnitPublicResource::make($unit)->resolve(),
            'similarUnits' => UnitPublicResource::collection($similarUnits),
            'relatedProjects' => ProjectPublicResource::collection($relatedProjects),
            'relatedArticles' => ArticlePublicResource::collection($relatedArticles),
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta, 'lcpImage' => $lcpImage]);
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
            $customMeta['robots'] = 'noindex, follow';
        }

        $pageKey = $isDeals ? 'deals' : 'units_index';

        return app(SeoService::class)->forPage($pageKey, $customMeta);
    }
}
