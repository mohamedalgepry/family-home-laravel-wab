<?php

namespace App\Domain\Listings\Services;

use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ListingImageService
{
    public function persistImages(Model $model, array $paths, array|callable $attributes = [], ?int $primaryIndex = null): void
    {
        $existingCount = $model->images()->count();
        $hasPrimary = $primaryIndex !== null && $model->images()->where('is_primary', true)->exists();

        foreach ($paths as $i => $path) {
            $extra = is_callable($attributes) ? $attributes($i) : $attributes;
            $row = array_merge(['path' => $path, 'sort_order' => $existingCount + $i + 1], $extra);

            if ($primaryIndex !== null) {
                $row['is_primary'] = ! $hasPrimary && $i === $primaryIndex;
                if ($row['is_primary']) {
                    $hasPrimary = true;
                }
            }

            $model->images()->create($row);
        }

        dispatch(new GenerateThumbnailsJob(
            modelType: $model::class,
            modelId: $model->id,
            paths: $paths,
        ))->afterCommit();
    }

    public function deleteImageFiles(array $paths): void
    {
        foreach ($paths as $path) {
            if (! $path) {
                continue;
            }

            Storage::disk('public')->delete($path);
            $this->deleteThumbnail($path);
        }
    }

    private function deleteThumbnail(string $path): void
    {
        $dir = dirname($path);
        $filename = basename($path);
        $filenameNoExt = pathinfo($filename, PATHINFO_FILENAME);
        $directory = $dir !== '.' ? $dir.'/' : '';

        Storage::disk('public')->delete([
            $directory.'thumb_'.$filenameNoExt.'.webp',
            // Remove legacy thumbnails generated with the original extension.
            $directory.'thumb_'.$filename,
        ]);
    }
}
