<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\PageViewService;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController
{
    public function __construct(
        private readonly ListingService $listingService,
        private readonly PageViewService $pageViewService,
    ) {}

    public function index(): Response
    {
        $filters = request()->only(['area_id', 'search', 'payment_method', 'finishing_type_id', 'features']);

        $projects = $this->listingService->getProjectsByFilters($filters);
        $areas = Cache::rememberForever('lookup_areas', fn () => Area::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']));
        $features = Cache::rememberForever('lookup_features', fn () => Feature::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));
        $finishingTypes = Cache::rememberForever('lookup_finishing_types', fn () => FinishingType::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']));

        return Inertia::render('Public/Projects/Index', [
            'projects' => $projects,
            'filters' => $filters,
            'areas' => $areas,
            'features' => $features,
            'finishingTypes' => $finishingTypes,
        ]);
    }

    public function show(string $slug): Response
    {
        $project = $this->listingService->getProjectBySlug($slug);

        if (! $project || ! $project->is_active) {
            abort(404);
        }

        $this->pageViewService->recordView(
            Project::class,
            $project->id,
            request()->ip(),
            request()->userAgent(),
        );

        $locale = app()->getLocale();
        $slug = "slug_{$locale}";
        $currentSlug = $project->$slug ?? $project->slug;
        $arSlug = $project->slug_ar ?? $project->slug;
        $enSlug = $project->slug_en ?? $project->slug;

        $meta = [
            'title' => $project->name.' - '.config('app.name'),
            'description' => str($project->meta_description ?? $project->description)->stripTags()->limit(150),
            'image' => $project->images?->firstWhere('is_primary', true)?->path ?? $project->images?->first()?->path,
            'canonical' => url("/{$locale}/projects/{$currentSlug}"),
            'hreflang' => [
                'ar' => url("/ar/projects/{$arSlug}"),
                'en' => url("/en/projects/{$enSlug}"),
                'x-default' => url("/ar/projects/{$arSlug}"),
            ],
            'schema' => '<script type="application/ld+json">'.json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'RealEstateListing',
                'name' => $project->name,
                'description' => str($project->meta_description ?? $project->description)->stripTags()->limit(150),
                'image' => $project->images?->firstWhere('is_primary', true) ? asset('storage/'.$project->images->firstWhere('is_primary', true)->path) : '',
            ], JSON_UNESCAPED_UNICODE).'</script>',
        ];

        return Inertia::render('Public/Projects/Show', [
            'project' => $project,
        ])->withViewData(['meta' => $meta]);
    }
}
