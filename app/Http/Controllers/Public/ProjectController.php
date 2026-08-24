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

class ProjectController
{
    public function __construct(
        private readonly ListingService $listingService,
        private readonly ListingLookupService $lookupService,
        private readonly PageViewService $pageViewService,
        private readonly SeoMetaService $seoMetaService,
    ) {}

    public function index(SearchService $searchService, \App\Domain\Listings\Services\FilterResolver $filterResolver): Response
    {
        $filters = request()->only(['area_id', 'search', 'payment_method', 'finishing_type_id', 'features']);

        if (! empty($filters['search'])) {
            $searchService->recordSearch($filters['search']);
        }

        $filters = $filterResolver->resolve($filters);

        $projects = $this->listingService->getProjectsByFilters($filters);

        $customMeta = [];
        if (! empty($filters['area_id'])) {
            $areas = $this->lookupService->areas();
            $area = collect($areas)->firstWhere('id', (int) $filters['area_id']);
            if ($area) {
                $areaName = app()->getLocale() === 'ar' ? ($area->name_ar ?? $area->name) : ($area->name_en ?? $area->name);
                $customMeta['title'] = (app()->getLocale() === 'ar' ? 'مشاريع سكنية وتجارية في ' : 'Real Estate Projects in ').$areaName.' - '.config('app.name');
            }
        }

        $meta = app(SeoService::class)->forPage('projects_index', $customMeta);

        return Inertia::render('Public/Projects/Index', [
            'projects' => ProjectPublicResource::collection($projects),
            'filters' => $filters,
            'seo_meta' => $meta,
            'areas' => $this->lookupService->areas(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
        ])->withViewData(['meta' => $meta]);
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

        $projectUnits = Unit::where('project_id', $project->id)
            ->where('is_active', true)
            ->with(['type', 'area', 'images', 'user.profile', 'finishingType'])
            ->orderByFeatured()
            ->get();

        $similarProjects = Project::where('is_active', true)
            ->where('id', '!=', $project->id)
            ->when($project->area_id, fn ($q) => $q->where('area_id', $project->area_id))
            ->with(['area', 'images', 'user.profile'])
            ->withCount(['units' => fn ($q) => $q->active()])
            ->orderByDesc('created_at')
            ->limit(4)
            ->get();

        if ($similarProjects->count() < 4) {
            $moreProjects = Project::where('is_active', true)
                ->where('id', '!=', $project->id)
                ->whereNotIn('id', $similarProjects->pluck('id'))
                ->with(['area', 'images', 'user.profile'])
                ->withCount(['units' => fn ($q) => $q->active()])
                ->orderByDesc('created_at')
                ->limit(4 - $similarProjects->count())
                ->get();
            $similarProjects = $similarProjects->concat($moreProjects);
        }

        $relatedArticles = Article::where('is_published', true)
            ->with(['images', 'category'])
            ->orderByDesc('published_at')
            ->limit(4)
            ->get();

        $meta = $this->seoMetaService->forListing($project, 'projects');

        $mainImage = $project->images->firstWhere('is_primary', true)
            ?? $project->images->first();

        $lcpImage = $mainImage ? $mainImage->url : null;

        return Inertia::render('Public/Projects/Show', [
            'project' => ProjectPublicResource::make($project)->resolve(),
            'projectUnits' => UnitPublicResource::collection($projectUnits),
            'similarProjects' => ProjectPublicResource::collection($similarProjects),
            'relatedArticles' => ArticlePublicResource::collection($relatedArticles),
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta, 'lcpImage' => $lcpImage]);
    }
}
