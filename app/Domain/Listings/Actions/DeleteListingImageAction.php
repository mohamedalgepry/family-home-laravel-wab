<?php

namespace App\Domain\Listings\Actions;

use Illuminate\Support\Facades\Storage;

/**
 * Deletes a stored listing image together with its generated thumbnail variants.
 */
class DeleteListingImageAction
{
    public function execute(string $path): void
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
}
