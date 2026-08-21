<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    public $timestamps = false;

    protected $fillable = ['name_ar', 'name_en', 'slug', 'slug_ar', 'slug_en'];

    protected static function booted(): void
    {
        static::creating(function (self $category) {
            if (! $category->slug) {
                $category->slug = \App\Domain\Common\Support\SlugHelper::makeEnglish($category->name_en ?: $category->name_ar, 'category');
            }
            if (! $category->slug_ar) {
                $category->slug_ar = \App\Domain\Common\Support\SlugHelper::makeArabic($category->name_ar ?: $category->name_en, $category->slug);
            }
            if (! $category->slug_en) {
                $category->slug_en = \App\Domain\Common\Support\SlugHelper::makeEnglish($category->name_en ?: $category->name_ar, $category->slug);
            }
            $category->ensureUniqueSlugs();
        });

        static::updating(function (self $category) {
            $changed = false;
            if ($category->isDirty('name_en') && ! $category->isDirty('slug_en')) {
                $category->slug_en = \App\Domain\Common\Support\SlugHelper::makeEnglish($category->name_en, 'category');
                $changed = true;
            }
            if ($category->isDirty('name_ar') && ! $category->isDirty('slug_ar')) {
                $category->slug_ar = \App\Domain\Common\Support\SlugHelper::makeArabic($category->name_ar, $category->slug_en ?? 'category');
                $changed = true;
            }
            if ($changed) {
                $category->ensureUniqueSlugs();
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

    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
