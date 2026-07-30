<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'category_id', 'title', 'title_ar', 'title_en', 'slug', 'slug_ar', 'slug_en', 'content', 'content_ar', 'content_en',
        'excerpt', 'excerpt_ar', 'excerpt_en', 'alt_text',
        'keywords', 'meta_description', 'is_published', 'published_at', 'views_count',
    ];

    public function resolveRouteBinding($value, $field = null)
    {
        if ($field) {
            return $this->where($field, $value)->firstOrFail();
        }

        return $this->where(function ($query) use ($value) {
            if (is_numeric($value)) {
                $query->where('id', (int) $value);
            }
            $query->orWhere('slug', $value)
                ->orWhere('slug_ar', $value)
                ->orWhere('slug_en', $value);
        })->firstOrFail();
    }

    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'views_count' => 'integer',
        ];
    }

    public function getTitleAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? ($this->title_ar ?? $value) : ($this->title_en ?? $value);
    }

    public function getContentAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? ($this->content_ar ?? $value) : ($this->content_en ?? $value);
    }

    public function getExcerptAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? ($this->excerpt_ar ?? $value) : ($this->excerpt_en ?? $value);
    }

    protected static function booted(): void
    {
        static::creating(function (self $article) {
            if (! $article->slug) {
                $article->slug = Str::slug($article->title_en ?: $article->title);
            }
            if (! $article->slug_ar) {
                $article->slug_ar = Str::slug($article->title_ar ?: $article->title) ?: $article->slug.'-ar';
            }
            if (! $article->slug_en) {
                $article->slug_en = Str::slug($article->title_en ?: $article->title) ?: $article->slug;
            }
            $article->ensureUniqueSlugs();
        });

        static::updating(function (self $article) {
            $changed = false;
            if ($article->isDirty('title_en') && ! $article->isDirty('slug_en')) {
                $article->slug_en = Str::slug($article->title_en);
                $changed = true;
            }
            if ($article->isDirty('title_ar') && ! $article->isDirty('slug_ar')) {
                $article->slug_ar = Str::slug($article->title_ar) ?: $article->slug_en.'-ar';
                $changed = true;
            }
            if ($changed) {
                $article->ensureUniqueSlugs();
            }
        });
    }

    protected function ensureUniqueSlugs(): void
    {
        foreach (['slug', 'slug_ar', 'slug_en'] as $field) {
            if (! $this->$field) {
                continue;
            }
            $base = $this->$field;
            $suffix = 1;
            while (self::where($field, $this->$field)->where('id', '!=', $this->id)->exists()) {
                $this->$field = $base.'-'.$suffix++;
            }
        }
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ArticleImage::class);
    }
}
