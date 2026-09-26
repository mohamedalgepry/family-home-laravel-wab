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

            $dangerousExtensions = [
                'php', 'php3', 'php4', 'php5', 'phtml', 'phar', 'cgi', 'pl', 'sh', 'bash', 'exe', 'bat', 'cmd', 'vbs', 'svg',
            ];
            $clientExt = strtolower($image->getClientOriginalExtension());
            $guessExt = strtolower($image->guessExtension() ?: '');

            if (in_array($clientExt, $dangerousExtensions, true) || in_array($guessExt, $dangerousExtensions, true)) {
                \Log::warning('StoreUploadedImagesAction: blocked dangerous file upload attempt', [
                    'original_name' => $image->getClientOriginalName(),
                    'client_extension' => $clientExt,
                    'guessed_extension' => $guessExt,
                    'mime' => $image->getMimeType(),
                ]);

                continue;
            }

            $mime = strtolower($image->getMimeType() ?: '');
            if (! str_starts_with($mime, 'image/')) {
                \Log::warning('StoreUploadedImagesAction: blocked non-image MIME upload attempt', [
                    'original_name' => $image->getClientOriginalName(),
                    'mime' => $mime,
                ]);

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
