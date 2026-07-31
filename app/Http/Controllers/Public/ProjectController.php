<?php

namespace App\Http\Controllers\Public;

use App\Domain\Common\Services\SeoMetaService;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Services\ListingLookupService;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\PageViewService;
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

    public function index(): Response
    {
        $filters = request()->only(['area_id', 'search', 'payment_method', 'finishing_type_id', 'features']);

        $projects = $this->listingService->getProjectsByFilters($filters);

        return Inertia::render('Public/Projects/Index', [
            'projects' => $projects,
            'filters' => $filters,
            'areas' => $this->lookupService->areas(),
            'features' => $this->lookupService->features(),
            'finishingTypes' => $this->lookupService->finishingTypes(),
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

        $meta = $this->seoMetaService->forListing($project, 'projects');

        return Inertia::render('Public/Projects/Show', [
            'project' => $project,
        ])->withViewData(['meta' => $meta]);
    }
}
