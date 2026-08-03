<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Media\Services\ImageOptimizerService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StoreUploadedImagesAction
{
    public function __construct(
        private readonly ImageOptimizerService $imageOptimizer,
    ) {}

    public function execute(array $images, string $folder): array
    {
        $paths = [];
        $year = now()->format('Y');
        $month = now()->format('m');

        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $originalPath = $image->store("{$folder}/{$year}/{$month}", 'public');
                $optimizedPath = preg_replace('/\.[^.]+$/', '.webp', $originalPath);
                $disk = Storage::disk('public');

                if (
                    $optimizedPath !== $originalPath
                    && $this->imageOptimizer->convertToWebp(
                        $disk->path($originalPath),
                        $disk->path($optimizedPath),
                    )
                ) {
                    $disk->delete($originalPath);
                    $paths[] = $optimizedPath;
                    continue;
                }

                // Preserve the upload if the server cannot encode WebP.
                $paths[] = $originalPath;
            }
        }

        return $paths;
    }
}
