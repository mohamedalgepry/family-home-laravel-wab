<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Actions\ManageAreaImagesAction;
use App\Domain\Listings\Actions\SyncAreaRelationsAction;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Services\ListingLookupService;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\SitemapService;
use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAreaRequest;
use App\Http\Requests\Admin\UpdateAreaRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AreaController extends Controller
{
    public function __construct(
        private readonly SitemapService $sitemapService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Area::class);

        $areas = Area::withCount(['projects', 'units'])
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name_ar', 'like', "%{$search}%")
                        ->orWhere('name_en', 'like', "%{$search}%");
                });
            })
            ->when(request('status') !== null, function ($query) {
                $query->where('is_active', request('status') === 'active');
            })
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Areas/Index', [
            'areas' => $areas,
            'filters' => request()->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Area::class);

        return Inertia::render('Admin/Areas/Create', [
            'parents' => Area::where('is_active', true)->get(['id', 'name_ar', 'name_en']),
        ]);
    }

    public function store(StoreAreaRequest $request, ManageAreaImagesAction $imagesAction, SyncAreaRelationsAction $syncRelationsAction): RedirectResponse
    {
        $this->authorize('create', Area::class);

        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['name_en'] ?? $validated['name_ar']);

        ['validated' => $validated, 'uploaded' => $uploadedPaths] = $imagesAction->forCreate($request, $validated);

        $area = Area::create($validated);

        $syncRelationsAction->execute($area, $request);

        if (! empty($uploadedPaths)) {
            dispatch(new GenerateThumbnailsJob(
                modelType: Area::class,
                modelId: $area->id,
                paths: $uploadedPaths,
            ))->afterCommit();
        }

        Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        Cache::increment(ListingService::CACHE_VERSION_KEY);
        $this->sitemapService->forgetCache();

        return redirect()->route('admin.areas.index')->with('success', __('common.added_successfully'));
    }

    public function edit(Area $area): Response
    {
        $this->authorize('update', $area);

        $area->load(['features', 'nearbyPlaces', 'faqs']);

        return Inertia::render('Admin/Areas/Edit', [
            'area' => $area,
            'parents' => Area::where('is_active', true)->where('id', '!=', $area->id)->get(['id', 'name_ar', 'name_en']),
        ]);
    }

    public function update(UpdateAreaRequest $request, Area $area, ManageAreaImagesAction $imagesAction, SyncAreaRelationsAction $syncRelationsAction): RedirectResponse
    {
        $this->authorize('update', $area);

        $validated = $request->validated();

        if ($area->name_en !== $validated['name_en'] || ! $area->slug) {
            $validated['slug'] = Str::slug($validated['name_en'] ?? $validated['name_ar']);
        }

        ['validated' => $validated, 'uploaded' => $newUploadedPaths] = $imagesAction->forUpdate($request, $area, $validated);

        $area->update($validated);

        $syncRelationsAction->execute($area, $request);

        if (! empty($newUploadedPaths)) {
            dispatch(new GenerateThumbnailsJob(
                modelType: Area::class,
                modelId: $area->id,
                paths: $newUploadedPaths,
            ))->afterCommit();
        }

        Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        Cache::increment(ListingService::CACHE_VERSION_KEY);
        $this->sitemapService->forgetCache();

        return redirect()->route('admin.areas.index')->with('success', __('common.updated_successfully'));
    }

    public function destroy(Area $area, ManageAreaImagesAction $imagesAction): RedirectResponse
    {
        $this->authorize('delete', $area);

        $imagesAction->deleteAllFor($area);

        $area->delete();

        Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        Cache::increment(ListingService::CACHE_VERSION_KEY);
        $this->sitemapService->forgetCache();

        return redirect()->back()->with('success', __('common.deleted_successfully'));
    }
}
