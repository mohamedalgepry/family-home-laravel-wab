<?php

namespace App\Domain\Listings\Models\Concerns;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

trait HasImageAttributes
{
    public function getUrlAttribute(): string
    {
        if (! $this->path) {
            return '';
        }

        if ($this->isExternalOrAbsolutePath($this->path)) {
            return $this->path;
        }

        return '/storage/'.ltrim($this->path, '/');
    }

    public function getThumbUrlAttribute(): string
    {
        if (! $this->path) {
            return '';
        }

        if ($this->isExternalOrAbsolutePath($this->path)) {
            return $this->url;
        }

        $webpThumbPath = $this->resolveWebpThumbPath();

        if ($this->thumbExistsOnDisk($webpThumbPath)) {
            return '/storage/'.$webpThumbPath;
        }

        $legacyThumbPath = $this->resolveLegacyThumbPath();

        return $this->thumbExistsOnDisk($legacyThumbPath)
            ? '/storage/'.$legacyThumbPath
            : $this->url;
    }

    private function isExternalOrAbsolutePath(string $path): bool
    {
        return str_starts_with($path, 'http://')
            || str_starts_with($path, 'https://')
            || str_starts_with($path, '/');
    }

    private function resolveWebpThumbPath(): string
    {
        $dir = dirname($this->path);
        $nameWithoutExtension = pathinfo($this->path, PATHINFO_FILENAME);
        $prefix = $dir !== '.' ? $dir.'/' : '';

        return $prefix.'thumb_'.$nameWithoutExtension.'.webp';
    }

    private function resolveLegacyThumbPath(): string
    {
        $dir = dirname($this->path);
        $filename = basename($this->path);
        $prefix = $dir !== '.' ? $dir.'/' : '';

        return $prefix.'thumb_'.$filename;
    }

    private function thumbExistsOnDisk(string $thumbPath): bool
    {
        return Cache::remember(
            "thumb_exists:{$thumbPath}",
            now()->addDay(),
            fn () => Storage::disk('public')->exists($thumbPath)
        );
    }
}
