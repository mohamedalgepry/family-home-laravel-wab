<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleImage extends Model
{
    protected $fillable = ['article_id', 'path', 'alt_text', 'position', 'size', 'sort_order'];

    protected $appends = ['url'];

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

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
