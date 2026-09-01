<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Media\Services\ImageOptimizerService;
use Illuminate\Http\UploadedFile;

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
        $disk = \Illuminate\Support\Facades\Storage::disk('public');

        foreach ($images as $image) {
            if (! $image instanceof UploadedFile) {
                continue;
            }

            // Generate a random name for WebP
            $name = \Illuminate\Support\Str::random(40) . '.webp';
            $relativePath = "{$folder}/{$year}/{$month}/{$name}";
            $absolutePath = $disk->path($relativePath);
            
            // Temporary path from upload
            $tempPath = $image->getRealPath();
            
            // Try optimizing directly via Service
            if ($this->imageOptimizer->convertToWebp($tempPath, $absolutePath)) {
                $paths[] = $relativePath;
            } else {
                // Fallback to normal upload if conversion fails
                $originalPath = $image->store("{$folder}/{$year}/{$month}", 'public');
                if ($originalPath !== false) {
                    $paths[] = $originalPath;
                } else {
                    \Log::error('StoreUploadedImagesAction: filesystem write failed', [
                        'folder' => $folder,
                        'original_name' => $image->getClientOriginalName(),
                        'size' => $image->getSize(),
                    ]);
                }
            }
        }

        return $paths;
    }
}
