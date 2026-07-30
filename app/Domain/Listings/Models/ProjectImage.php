<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    protected $fillable = ['project_id', 'path', 'alt_text', 'sort_order'];

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

        if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://') || str_starts_with($this->path, '/')) {
            return $this->url;
        }

        $dir = dirname($this->path);
        $filename = basename($this->path);
        $thumbPath = ($dir !== '.' ? $dir.'/' : '').'thumb_'.$filename;

        if (! \Illuminate\Support\Facades\Storage::disk('public')->exists($thumbPath)) {
            return $this->url;
        }

        return '/storage/'.$thumbPath;
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
