<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\ListingLookupService;
use App\Http\Resources\Public\AreaPublicResource;
use App\Http\Resources\Public\ProjectPublicResource;
use App\Http\Resources\Public\UnitPublicResource;
use App\Services\SeoService;
use Illuminate\Support\Facades\Cache;
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
            ->with(['features', 'nearbyPlaces', 'faqs'])
            ->withCount(['projects' => function ($q) {
                $q->active();
            }, 'units' => function ($q) {
                $q->active();
            }])
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
            ->paginate(12, ['*'], 'units_page', $unitsPage);

        $projects = Project::where('is_active', true)
            ->where('area_id', $area->id)
            ->with(['area', 'images'])
            ->withCount(['units' => function ($q) {
                $q->active();
            }])
            ->orderByDesc('created_at')
            ->paginate(12, ['*'], 'projects_page', $projectsPage);

        $locale = app()->getLocale();
        $areaName = $locale === 'ar' ? ($area->name_ar ?? $area->name_en) : ($area->name_en ?? $area->name_ar);

        $metaTitle = $locale === 'ar'
            ? ($area->meta_title_ar ?: "عقارات ومشاريع في {$areaName} - " . config('app.name'))
            : ($area->meta_title_en ?: "Properties & Projects in {$areaName} - " . config('app.name'));

        $metaDescription = $locale === 'ar'
            ? ($area->meta_description_ar ?: "تصفح أفضل الوحدات والمشاريع العقارية المتاحة للبيع والاستثمار في منطقة {$areaName}.")
            : ($area->meta_description_en ?: "Explore the best real estate units and projects available in {$areaName}.");


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
        $meta['og_image'] = $ogImage;
        $meta['og_title'] = $metaTitle;
        $meta['og_description'] = $metaDescription;
        $meta['canonical'] = $canonical;
        $meta['hreflang'] = $hreflang;
        $placeSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Place',
            '@id' => $canonical.'#place',
            'name' => $areaName,
            'description' => $metaDescription,
            'url' => $canonical,
        ];
        
        if ($ogImage) {
            $placeSchema['image'] = [$ogImage];
        }
        
        if (!empty($area->latitude) && !empty($area->longitude) && $area->latitude != '0' && $area->longitude != '0') {
            $placeSchema['geo'] = [
                '@type' => 'GeoCoordinates',
                'latitude' => $area->latitude,
                'longitude' => $area->longitude,
            ];
        }

        $schemas = [
            $this->seoService->getBreadcrumbSchema([
                __('seo.site_name') => url("/{$locale}"),
                ($locale === 'ar' ? 'المناطق' : 'Areas') => url("/{$locale}/units"),
                $areaName => $canonical,
            ]),
            $placeSchema,
        ];

        if ($area->faqs && $area->faqs->count() > 0) {
            $faqElements = [];
            foreach ($area->faqs as $faq) {
                if ($faq->is_active) {
                    $question = $locale === 'ar' ? $faq->question_ar : ($faq->question_en ?: $faq->question_ar);
                    $answer = $locale === 'ar' ? $faq->answer_ar : ($faq->answer_en ?: $faq->answer_ar);
                    if ($question && $answer) {
                        $faqElements[] = [
                            '@type' => 'Question',
                            'name' => $question,
                            'acceptedAnswer' => [
                                '@type' => 'Answer',
                                'text' => $answer,
                            ],
                        ];
                    }
                }
            }
            if (count($faqElements) > 0) {
                $schemas[] = [
                    '@context' => 'https://schema.org',
                    '@type' => 'FAQPage',
                    'mainEntity' => $faqElements,
                ];
            }
        }

        $meta['schema'] = $schemas;

        // Cache relatedAreas to avoid ORDER BY RAND() full table scan on every request
        $relatedAreas = Cache::remember(
            "area_{$area->id}_related",
            600,
            fn () => Area::active()
                ->where('id', '!=', $area->id)
                ->withCount(['projects' => fn ($q) => $q->active()])
                ->inRandomOrder()
                ->take(3)
                ->get()
        );


        return Inertia::render('Public/Areas/Show', [
            'area' => AreaPublicResource::make($area)->resolve(),
            'relatedAreas' => AreaPublicResource::collection($relatedAreas),
            'units' => UnitPublicResource::collection($units),
            'projects' => ProjectPublicResource::collection($projects),
            'seo_meta' => $meta,
            'seo' => [
                'title' => $metaTitle,
                'description' => $metaDescription,
                'ogImage' => $ogImage,
            ],
            'areas' => $this->lookupService->areas(),
            'unitTypes' => $this->lookupService->unitTypes(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ])->withViewData(['meta' => $meta]);
    }
}
