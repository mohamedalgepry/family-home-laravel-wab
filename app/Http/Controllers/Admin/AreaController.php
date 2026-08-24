<?php

namespace App\Http\Controllers\Admin;

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
use Illuminate\Support\Facades\Storage;
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

        $uploadedPaths = [];

        // Handle Image Path (Card Image)
        if ($request->hasFile('image_path')) {
            $path = $request->file('image_path')->store('areas/cards', 'public');
            $validated['image_path'] = $path;
            $uploadedPaths[] = $path;
        } else {
            unset($validated['image_path']);
        }

        // Handle Hero Image
        if ($request->hasFile('hero_image')) {
            $path = $request->file('hero_image')->store('areas/hero', 'public');
            $validated['hero_image'] = $path;
            $uploadedPaths[] = $path;
        } else {
            unset($validated['hero_image']);
        }

        // Handle Gallery
        if ($request->hasFile('gallery')) {
            $gallery = [];
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('areas/gallery', 'public');
                $gallery[] = $path;
                $uploadedPaths[] = $path;
            }
            $validated['gallery'] = $gallery;
        } else {
            unset($validated['gallery']);
        }

        $area = Area::create($validated);

        $this->syncRelations($area, $request);

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

    public function update(UpdateAreaRequest $request, Area $area): RedirectResponse
    {
        $this->authorize('update', $area);

        $validated = $request->validated();

        if ($area->name_en !== $validated['name_en'] || ! $area->slug) {
            $validated['slug'] = Str::slug($validated['name_en'] ?? $validated['name_ar']);
        }

        $newUploadedPaths = [];

        // Handle Image Path (Card Image)
        if ($request->hasFile('image_path')) {
            if ($area->image_path && Storage::disk('public')->exists($area->image_path)) {
                $this->deleteImageAndThumbnail($area->image_path);
            }
            $path = $request->file('image_path')->store('areas/cards', 'public');
            $validated['image_path'] = $path;
            $newUploadedPaths[] = $path;
        } elseif (array_key_exists('image_path', $validated) && $validated['image_path'] === null) {
            // User explicitly cleared the image
            if ($area->image_path && Storage::disk('public')->exists($area->image_path)) {
                $this->deleteImageAndThumbnail($area->image_path);
            }
            $validated['image_path'] = null;
        } else {
            unset($validated['image_path']);
        }

        // Handle Hero Image
        if ($request->hasFile('hero_image')) {
            if ($area->hero_image && Storage::disk('public')->exists($area->hero_image)) {
                $this->deleteImageAndThumbnail($area->hero_image);
            }
            $path = $request->file('hero_image')->store('areas/hero', 'public');
            $validated['hero_image'] = $path;
            $newUploadedPaths[] = $path;
        } elseif (array_key_exists('hero_image', $validated) && $validated['hero_image'] === null) {
            if ($area->hero_image && Storage::disk('public')->exists($area->hero_image)) {
                $this->deleteImageAndThumbnail($area->hero_image);
            }
            $validated['hero_image'] = null;
        } else {
            unset($validated['hero_image']);
        }

        // Handle Gallery
        if ($request->hasFile('gallery')) {
            if ($area->gallery) {
                foreach ($area->gallery as $oldFile) {
                    if (Storage::disk('public')->exists($oldFile)) {
                        $this->deleteImageAndThumbnail($oldFile);
                    }
                }
            }
            $gallery = [];
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('areas/gallery', 'public');
                $gallery[] = $path;
                $newUploadedPaths[] = $path;
            }
            $validated['gallery'] = $gallery;
        } else {
            unset($validated['gallery']);
        }

        $area->update($validated);

        $this->syncRelations($area, $request);

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

    public function destroy(Area $area): RedirectResponse
    {
        $this->authorize('delete', Area::class);

        if ($area->image_path && Storage::disk('public')->exists($area->image_path)) {
            $this->deleteImageAndThumbnail($area->image_path);
        }
        if ($area->hero_image && Storage::disk('public')->exists($area->hero_image)) {
            $this->deleteImageAndThumbnail($area->hero_image);
        }
        if ($area->gallery) {
            foreach ($area->gallery as $oldFile) {
                if (Storage::disk('public')->exists($oldFile)) {
                    $this->deleteImageAndThumbnail($oldFile);
                }
            }
        }

        $area->delete();

        Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        Cache::increment(ListingService::CACHE_VERSION_KEY);
        $this->sitemapService->forgetCache();

        return redirect()->back()->with('success', __('common.deleted_successfully'));
    }

    private function deleteImageAndThumbnail(string $path): void
    {
        Storage::disk('public')->delete($path);

        $dir = dirname($path);
        $filename = basename($path);
        $filenameNoExt = pathinfo($filename, PATHINFO_FILENAME);
        $directory = $dir !== '.' ? $dir.'/' : '';

        Storage::disk('public')->delete([
            $directory.'thumb_'.$filenameNoExt.'.webp',
            $directory.'thumb_'.$filename,
        ]);
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
            $payload = collect($item)->except(['id', 'created_at', 'updated_at', 'area_id'])->toArray();

                if (isset($item['id']) && in_array($item['id'], $existingIds)) {
                        $area->{$relation}()->where('id', $item['id'])->update($payload);
                                $newIds[] = $item['id'];
                                    } else {
                                            $created = $area->{$relation}()->create($payload);
                                                    $newIds[] = $created->id;
                                                        }
                                                        }
    }

        $idsToDelete = array_diff($existingIds, $newIds);
        if (count($idsToDelete) > 0) {
            $area->{$relation}()->whereIn('id', $idsToDelete)->delete();
        }
    }
}
