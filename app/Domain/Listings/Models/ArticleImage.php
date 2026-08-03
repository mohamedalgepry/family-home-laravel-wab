<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleImage extends Model
{
    protected $fillable = ['article_id', 'path', 'alt_text', 'position', 'size', 'sort_order'];

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
        $filenameNoExt = pathinfo($filename, PATHINFO_FILENAME);
        $directory = $dir !== '.' ? $dir.'/' : '';
        $thumbPath = $directory.'thumb_'.$filenameNoExt.'.webp';
        $legacyThumbPath = $directory.'thumb_'.$filename;

        $exists = \Illuminate\Support\Facades\Cache::remember(
            "thumb_exists:{$thumbPath}",
            now()->addDay(),
            fn () => \Illuminate\Support\Facades\Storage::disk('public')->exists($thumbPath)
        );

        if ($exists) {
            return '/storage/'.$thumbPath;
        }

        return \Illuminate\Support\Facades\Storage::disk('public')->exists($legacyThumbPath)
            ? '/storage/'.$legacyThumbPath
            : $this->url;
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
