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
            if (! $image instanceof UploadedFile) {
                continue;
            }

            $originalPath = $image->store("{$folder}/{$year}/{$month}", 'public');

            if ($originalPath === false) {
                \Log::error('StoreUploadedImagesAction: filesystem write failed', [
                    'folder' => $folder,
                    'original_name' => $image->getClientOriginalName(),
                    'size' => $image->getSize(),
                ]);

                continue;
            }

            $paths[] = $originalPath;
        }

        return $paths;
    }
}
