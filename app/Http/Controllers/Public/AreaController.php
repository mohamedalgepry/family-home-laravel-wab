<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\ListingLookupService;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class AreaController
{
    public function __construct(
        private readonly ListingLookupService $lookupService,
        private readonly SeoService $seoService,
    ) {}

    public function show(string $slug): Response
    {
        $area = Area::active()
            ->where(function ($query) use ($slug) {
                $query->where('slug', $slug)
                    ->orWhere('id', is_numeric($slug) ? (int) $slug : 0);
            })
            ->first();

        if (! $area) {
            abort(404);
        }

        $unitsPage = (int) request()->input('units_page', 1);
        $projectsPage = (int) request()->input('projects_page', 1);

        $units = Unit::active()
            ->where('area_id', $area->id)
            ->with(['type', 'area', 'images', 'user.profile', 'project.user.profile'])
            ->orderByFeatured()
            ->simplePaginate(12, ['*'], 'units_page', $unitsPage);

        $projects = Project::where('is_active', true)
            ->where('area_id', $area->id)
            ->with(['area', 'images'])
            ->withCount(['units' => function ($q) {
                $q->active();
            }])
            ->orderByDesc('created_at')
            ->simplePaginate(12, ['*'], 'projects_page', $projectsPage);

        $locale = app()->getLocale();
        $areaName = $locale === 'ar' ? ($area->name_ar ?? $area->name_en) : ($area->name_en ?? $area->name_ar);

        $metaTitle = $locale === 'ar'
            ? ($area->meta_title_ar ?: "عقارات ومشاريع في {$areaName} - " . config('app.name'))
            : ($area->meta_title_en ?: "Properties & Projects in {$areaName} - " . config('app.name'));

        $metaDescription = $locale === 'ar'
            ? ($area->meta_description_ar ?: "تصفح أفضل الوحدات والمشاريع العقارية المتاحة للبيع والاستثمار في منطقة {$areaName}.")
            : ($area->meta_description_en ?: "Explore the best real estate units and projects available in {$areaName}.");

        $keywordsList = $locale === 'ar'
            ? ($area->meta_keywords_ar ?? ["عقارات {$areaName}", "شقق للبيع في {$areaName}", "مشاريع {$areaName}"])
            : ($area->meta_keywords_en ?? ["Real Estate {$areaName}", "Apartments in {$areaName}", "Projects {$areaName}"]);

        $ogImage = null;
        if ($area->image_path) {
            $ogImage = str_starts_with($area->image_path, 'http') ? $area->image_path : asset('storage/' . $area->image_path);
        } elseif ($units->first()?->images?->first()) {
            $img = $units->first()->images->first();
            $ogImage = $img->url ?? asset('storage/' . $img->path);
        } elseif ($projects->first()?->images?->first()) {
            $img = $projects->first()->images->first();
            $ogImage = $img->url ?? asset('storage/' . $img->path);
        }

        $canonical = url("/{$locale}/areas/{$area->slug}");
        $hreflang = [
            'ar' => url("/ar/areas/{$area->slug}"),
            'en' => url("/en/areas/{$area->slug}"),
            'x-default' => url("/ar/areas/{$area->slug}"),
        ];

        $customMeta = [
            'title' => $metaTitle,
            'description' => $metaDescription,
            'keywords' => is_array($keywordsList) ? implode(', ', $keywordsList) : $keywordsList,
            'canonical' => $canonical,
            'hreflang' => $hreflang,
            'ogTitle' => $metaTitle,
            'ogDescription' => $metaDescription,
            'ogImage' => $ogImage,
            'ogUrl' => $canonical,
            'ogType' => 'website',
            'twitterCard' => 'summary_large_image',
            'twitterTitle' => $metaTitle,
            'twitterDescription' => $metaDescription,
            'twitterImage' => $ogImage,
        ];

        $meta = $this->seoService->forPage('home', $customMeta);
        $meta['keywords'] = is_array($keywordsList) ? implode(', ', $keywordsList) : $keywordsList;
        $meta['og_image'] = $ogImage;
        $meta['og_title'] = $metaTitle;
        $meta['og_description'] = $metaDescription;
        $meta['canonical'] = $canonical;
        $meta['hreflang'] = $hreflang;
        $meta['schema'] = [
            $this->seoService->getBreadcrumbSchema([
                __('seo.site_name') => url("/{$locale}"),
                ($locale === 'ar' ? 'المناطق' : 'Areas') => url("/{$locale}/units"),
                $areaName => $canonical,
            ]),
            [
                '@context' => 'https://schema.org',
                '@type' => 'Place',
                '@id' => $canonical.'#place',
                'name' => $areaName,
                'description' => $metaDescription,
                'url' => $canonical,
            ],
        ];

        return Inertia::render('Public/Areas/Show', [
            'area' => $area,
            'units' => $units,
            'projects' => $projects,
            'seo_meta' => $meta,
            'seo' => [
                'title' => $metaTitle,
                'description' => $metaDescription,
                'keywords' => $keywordsList,
                'ogImage' => $ogImage,
            ],
            'areas' => $this->lookupService->areas(),
            'unitTypes' => $this->lookupService->unitTypes(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ])->withViewData(['meta' => $meta]);
    }
}
