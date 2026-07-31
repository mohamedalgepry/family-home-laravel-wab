<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class UnitImage extends Model
{
    protected $fillable = ['unit_id', 'path', 'alt_text', 'sort_order', 'is_primary'];

    protected $appends = ['url', 'thumb_url'];

    public function getUrlAttribute(): string
    {
        if (! $this->path) {
            return '';
        }

        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://')) {
            return $this->path;
        }

        if (str_starts_with($this->path, '/')) {
            return $this->path;
        }

        return '/storage/'.ltrim($this->path, '/');
    }

    public function getThumbUrlAttribute(): string
    {
        if (! $this->path) {
            return '';
        }

        // External or absolute URLs — return as-is (no thumbnail variant)
        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://') || str_starts_with($this->path, '/')) {
            return $this->url;
        }

        // Compute thumbnail path by convention (set by GenerateThumbnailsJob)
        $dir       = dirname($this->path);
        $filename  = basename($this->path);
        $thumbPath = ($dir !== '.' ? $dir . '/' : '') . 'thumb_' . $filename;

        // Return the expected thumbnail URL — the job guarantees its existence.
        // Avoids Storage::exists() disk I/O on every image serialization.
        return '/storage/' . $thumbPath;
    }

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
