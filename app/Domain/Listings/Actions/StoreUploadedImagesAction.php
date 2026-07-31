<?php

namespace App\Domain\Listings\Actions;

use Illuminate\Http\UploadedFile;

class StoreUploadedImagesAction
{
    public function execute(array $images, string $folder): array
    {
        $paths = [];
        $year = now()->format('Y');
        $month = now()->format('m');

        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $paths[] = $image->store("{$folder}/{$year}/{$month}", 'public');
            }
        }

        return $paths;
    }
}
