<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Area;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAreaRequest;
use App\Http\Requests\Admin\UpdateAreaRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use App\Domain\Listings\Services\SitemapService;
use Illuminate\Support\Facades\Cache;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\ListingLookupService;
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
                $query->where('name_ar', 'like', "%{$search}%")
                    ->orWhere('name_en', 'like', "%{$search}%");
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

    public function store(StoreAreaRequest $request): RedirectResponse
    {
        $this->authorize('create', Area::class);

        $validated = $request->validated();
        $validated['slug'] = Str::slug($validated['name_en'] ?? $validated['name_ar']);

        // Handle Main Image Path
        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('areas', 'public');
        }

        // Handle Hero Image
        if ($request->hasFile('hero_image')) {
            $validated['hero_image'] = $request->file('hero_image')->store('areas/hero', 'public');
        }

        // Handle Gallery
        if ($request->hasFile('gallery')) {
            $gallery = [];
            foreach ($request->file('gallery') as $file) {
                $gallery[] = $file->store('areas/gallery', 'public');
            }
            $validated['gallery'] = $gallery;
        }

        $area = Area::create($validated);

        // Sync Relations
        $this->syncRelations($area, $request);

        Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        Cache::increment(ListingService::CACHE_VERSION_KEY);
        $this->sitemapService->regenerate();

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

    public function update(UpdateAreaRequest $request, Area $area): RedirectResponse
    {
        $this->authorize('update', $area);

        $validated = $request->validated();

        if ($area->name_en !== $validated['name_en'] || ! $area->slug) {
            $validated['slug'] = Str::slug($validated['name_en'] ?? $validated['name_ar']);
        }

        // Handle Main Image Path
        if ($request->hasFile('image_path')) {
            if ($area->image_path && Storage::disk('public')->exists($area->image_path)) {
                Storage::disk('public')->delete($area->image_path);
            }
            $validated['image_path'] = $request->file('image_path')->store('areas', 'public');
        }

        // Handle Hero Image
        if ($request->hasFile('hero_image')) {
            if ($area->hero_image && Storage::disk('public')->exists($area->hero_image)) {
                Storage::disk('public')->delete($area->hero_image);
            }
            $validated['hero_image'] = $request->file('hero_image')->store('areas/hero', 'public');
        }

        // Handle Gallery (append or replace? For simplicity, replace if new files provided)
        if ($request->hasFile('gallery')) {
            if ($area->gallery) {
                foreach ($area->gallery as $oldFile) {
                    if (Storage::disk('public')->exists($oldFile)) {
                        Storage::disk('public')->delete($oldFile);
                    }
                }
            }
            $gallery = [];
            foreach ($request->file('gallery') as $file) {
                $gallery[] = $file->store('areas/gallery', 'public');
            }
            $validated['gallery'] = $gallery;
        }

        $area->update($validated);

        // Sync Relations
        $this->syncRelations($area, $request);

        Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        Cache::increment(ListingService::CACHE_VERSION_KEY);
        $this->sitemapService->regenerate();

        return redirect()->route('admin.areas.index')->with('success', __('common.updated_successfully'));
    }

    public function destroy(Area $area): RedirectResponse
    {
        $this->authorize('delete', Area::class);

        if ($area->image_path && Storage::disk('public')->exists($area->image_path)) {
            Storage::disk('public')->delete($area->image_path);
        }
        if ($area->hero_image && Storage::disk('public')->exists($area->hero_image)) {
            Storage::disk('public')->delete($area->hero_image);
        }
        if ($area->gallery) {
            foreach ($area->gallery as $oldFile) {
                if (Storage::disk('public')->exists($oldFile)) {
                    Storage::disk('public')->delete($oldFile);
                }
            }
        }

        $area->delete();

        Cache::forget(ListingLookupService::CACHE_KEY_AREAS);

        Cache::increment(ListingService::CACHE_VERSION_KEY);
        $this->sitemapService->regenerate();

        return redirect()->back()->with('success', __('common.deleted_successfully'));
    }

    private function syncRelations(Area $area, $request): void
    {
        if ($request->has('features')) {
            $features = $request->input('features') ?: [];
            $this->syncHasMany($area, 'features', $features);
        }
        
        if ($request->has('nearby_places')) {
            $places = $request->input('nearby_places') ?: [];
            $this->syncHasMany($area, 'nearbyPlaces', $places);
        }
        
        if ($request->has('faqs')) {
            $faqs = $request->input('faqs') ?: [];
            $this->syncHasMany($area, 'faqs', $faqs);
        }
    }

    private function syncHasMany(Area $area, string $relation, array $items): void
    {
        $existingIds = $area->{$relation}()->pluck('id')->toArray();
        $newIds = [];

        foreach ($items as $item) {
            if (isset($item['id']) && in_array($item['id'], $existingIds)) {
                $area->{$relation}()->where('id', $item['id'])->update($item);
                $newIds[] = $item['id'];
            } else {
                $created = $area->{$relation}()->create($item);
                $newIds[] = $created->id;
            }
        }

        $idsToDelete = array_diff($existingIds, $newIds);
        if (count($idsToDelete) > 0) {
            $area->{$relation}()->whereIn('id', $idsToDelete)->delete();
        }
    }
}
