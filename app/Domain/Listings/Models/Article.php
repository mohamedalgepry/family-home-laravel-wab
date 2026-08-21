<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'category_id', 'title', 'title_ar', 'title_en', 'slug', 'slug_ar', 'slug_en', 'content', 'content_ar', 'content_en',
        'excerpt', 'excerpt_ar', 'excerpt_en', 'alt_text', 'alt_text_ar', 'alt_text_en',
        'keywords', 'keywords_ar', 'keywords_en', 'meta_description', 'meta_description_ar', 'meta_description_en',
        'is_published', 'published_at', 'views_count',
    ];

    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'keywords_ar' => 'array',
            'keywords_en' => 'array',
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

    public function getMetaDescriptionAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar'
            ? ($this->meta_description_ar ?? $value ?? $this->meta_description_en)
            : ($this->meta_description_en ?? $value ?? $this->meta_description_ar);
    }

    public function getKeywordsAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar'
            ? ($this->keywords_ar ?? $value ?? $this->keywords_en ?? [])
            : ($this->keywords_en ?? $value ?? $this->keywords_ar ?? []);
    }

    public function getAltTextAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar'
            ? ($this->alt_text_ar ?? $value ?? $this->alt_text_en)
            : ($this->alt_text_en ?? $value ?? $this->alt_text_ar);
    }

    protected static function booted(): void
    {
        static::creating(function (self $article) {
            if (empty($article->title)) {
                $article->title = $article->title_ar ?: ($article->title_en ?: '');
            }
            if (empty($article->content)) {
                $article->content = $article->content_ar ?: ($article->content_en ?: '');
            }
            if (empty($article->excerpt)) {
                $article->excerpt = $article->excerpt_ar ?: ($article->excerpt_en ?: null);
            }
            if (! $article->slug) {
                $article->slug = \App\Domain\Common\Support\SlugHelper::makeEnglish($article->title_en ?: $article->title, 'article');
            }
            if (! $article->slug_ar) {
                $article->slug_ar = \App\Domain\Common\Support\SlugHelper::makeArabic($article->title_ar ?: $article->title, $article->slug);
            }
            if (! $article->slug_en) {
                $article->slug_en = \App\Domain\Common\Support\SlugHelper::makeEnglish($article->title_en ?: $article->title, $article->slug);
            }
            $article->ensureUniqueSlugs();
        });

        static::updating(function (self $article) {
            $changed = false;
            if ($article->isDirty('title_en') && ! $article->isDirty('slug_en')) {
                $article->slug_en = \App\Domain\Common\Support\SlugHelper::makeEnglish($article->title_en, 'article');
                $changed = true;
            }
            if ($article->isDirty('title_ar') && ! $article->isDirty('slug_ar')) {
                $article->slug_ar = \App\Domain\Common\Support\SlugHelper::makeArabic($article->title_ar, $article->slug_en ?? 'article');
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
