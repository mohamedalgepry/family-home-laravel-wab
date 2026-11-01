<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Owns the area card/hero/gallery image lifecycle: upload screening, dated
 * storage, replacement (new file first, then old file deletion) and cleanup.
 */
class ManageAreaImagesAction
{
    private const SINGLE_IMAGES = [
        'image_path' => 'areas/cards',
        'hero_image' => 'areas/hero',
    ];

    public function __construct(
        private readonly StoreUploadedImagesAction $storeUploadedImagesAction,
        private readonly DeleteListingImageAction $deleteListingImageAction,
    ) {}

    /**
     * @return array{validated: array, uploaded: array<int, string>}
     */
    public function forCreate(Request $request, array $validated): array
    {
        $uploaded = [];

        foreach (self::SINGLE_IMAGES as $field => $folder) {
            if (! $request->hasFile($field)) {
                unset($validated[$field]);

                continue;
            }

            $paths = $this->storeUploadedImagesAction->execute([$request->file($field)], $folder);

            if (empty($paths)) {
                unset($validated[$field]);

                continue;
            }

            $validated[$field] = $paths[0];
            $uploaded[] = $paths[0];
        }

        if (! $request->hasFile('gallery')) {
            unset($validated['gallery']);

            return ['validated' => $validated, 'uploaded' => $uploaded];
        }

        $gallery = $this->storeUploadedImagesAction->execute($request->file('gallery'), 'areas/gallery');
        $validated['gallery'] = $gallery;
        array_push($uploaded, ...$gallery);

        return ['validated' => $validated, 'uploaded' => $uploaded];
    }

    /**
     * @return array{validated: array, uploaded: array<int, string>}
     */
    public function forUpdate(Request $request, Area $area, array $validated): array
    {
        $uploaded = [];

        foreach (self::SINGLE_IMAGES as $field => $folder) {
            $this->replaceSingle($request, $area, $field, $folder, $validated, $uploaded);
        }

        $this->replaceGallery($request, $area, $validated, $uploaded);

        return ['validated' => $validated, 'uploaded' => $uploaded];
    }

    /**
     * Deletes every stored image belonging to the area (used before deletion).
     */
    public function deleteAllFor(Area $area): void
    {
        foreach (array_keys(self::SINGLE_IMAGES) as $field) {
            if ($area->{$field} && Storage::disk('public')->exists($area->{$field})) {
                $this->deleteListingImageAction->execute($area->{$field});
            }
        }

        foreach ($area->gallery ?? [] as $oldFile) {
            if (Storage::disk('public')->exists($oldFile)) {
                $this->deleteListingImageAction->execute($oldFile);
            }
        }
    }

    private function replaceSingle(
        Request $request,
        Area $area,
        string $field,
        string $folder,
        array &$validated,
        array &$uploaded,
    ): void {
        if ($request->hasFile($field)) {
            $paths = $this->storeUploadedImagesAction->execute([$request->file($field)], $folder);

            if (empty($paths)) {
                unset($validated[$field]);

                return;
            }

            // Store first, delete afterwards: a rejected upload must never wipe the current image.
            if ($area->{$field} && Storage::disk('public')->exists($area->{$field})) {
                $this->deleteListingImageAction->execute($area->{$field});
            }

            $validated[$field] = $paths[0];
            $uploaded[] = $paths[0];

            return;
        }

        if (array_key_exists($field, $validated) && $validated[$field] === null) {
            if ($area->{$field} && Storage::disk('public')->exists($area->{$field})) {
                $this->deleteListingImageAction->execute($area->{$field});
            }

            $validated[$field] = null;

            return;
        }

        unset($validated[$field]);
    }

    private function replaceGallery(Request $request, Area $area, array &$validated, array &$uploaded): void
    {
        if (! $request->hasFile('gallery')) {
            unset($validated['gallery']);

            return;
        }

        $gallery = $this->storeUploadedImagesAction->execute($request->file('gallery'), 'areas/gallery');

        if (empty($gallery)) {
            unset($validated['gallery']);

            return;
        }

        foreach ($area->gallery ?? [] as $oldFile) {
            if (Storage::disk('public')->exists($oldFile)) {
                $this->deleteListingImageAction->execute($oldFile);
            }
        }

        $validated['gallery'] = $gallery;
        array_push($uploaded, ...$gallery);
    }
}
