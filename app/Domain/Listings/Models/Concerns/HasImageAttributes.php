<?php

namespace App\Domain\Listings\Models\Concerns;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

trait HasImageAttributes
{
    public function getUrlAttribute(): string
    {
        return $this->path && ! $this->isExternalOrAbsolutePath($this->path)
            ? '/storage/'.ltrim($this->path, '/')
            : (string) $this->path;
    }

    public function getThumbUrlAttribute(): string
    {
        return $this->variantUrl('thumb') ?: $this->url;
    }

    public function getMediumUrlAttribute(): string
    {
        return $this->variantUrl('medium') ?: $this->url;
    }

    public function getLargeUrlAttribute(): string
    {
        return $this->variantUrl('large') ?: $this->medium_url;
    }

    public function getSrcsetAttribute(): ?string
    {
        if (! $this->path || $this->isExternalOrAbsolutePath($this->path)) {
            return null;
        }

        $sources = [];
        foreach (['thumb' => 480, 'medium' => 960, 'large' => 1440] as $variant => $width) {
            $url = $this->variantUrl($variant);
            if ($url) {
                $sources[] = "{$url} {$width}w";
            }
        }

        if ($this->url && ! in_array($this->url, array_map(fn ($s) => explode(' ', $s)[0], $sources))) {
            $sources[] = "{$this->url} 1920w";
        }

        return $sources === [] ? null : implode(', ', $sources);
    }

    private function variantUrl(string $variant): ?string
    {
        if (! $this->path || $this->isExternalOrAbsolutePath($this->path)) {
            return null;
        }

        $path = $this->variantRelativePath($variant);

        return $this->variantExists($variant, $path) ? '/storage/'.$path : null;
    }

    private function variantRelativePath(string $variant): string
    {
        $dir = dirname($this->path);
        $filename = pathinfo($this->path, PATHINFO_FILENAME);
        $prefix = $dir !== '.' ? $dir.'/' : '';

        return $prefix."{$variant}_{$filename}.webp";
    }

    private function variantExists(string $variant, string $path): bool
    {
        return Cache::remember(
            "image_variant_exists:{$variant}:{$this->path}",
            now()->addDay(),
            fn () => Storage::disk('public')->exists($path)
        );
    }

    private function isExternalOrAbsolutePath(string $path): bool
    {
        return str_starts_with($path, 'http://')
            || str_starts_with($path, 'https://')
            || str_starts_with($path, '/');
    }
}
