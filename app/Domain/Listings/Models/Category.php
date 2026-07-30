<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    public $timestamps = false;

    protected $fillable = ['name_ar', 'name_en', 'slug', 'slug_ar', 'slug_en'];

    public function resolveRouteBinding($value, $field = null)
    {
        if ($field) {
            return $this->where($field, $value)->firstOrFail();
        }

        if (is_numeric($value)) {
            return $this->where('id', $value)->first()
                ?? $this->where('slug', $value)->orWhere('slug_ar', $value)->orWhere('slug_en', $value)->firstOrFail();
        }

        return $this->where('slug', $value)
            ->orWhere('slug_ar', $value)
            ->orWhere('slug_en', $value)
            ->firstOrFail();
    }

    protected static function booted(): void
    {
        static::creating(function (self $category) {
            if (! $category->slug) {
                $category->slug = Str::slug($category->name_en ?: $category->name_ar);
            }
            if (! $category->slug_ar) {
                $category->slug_ar = Str::slug($category->name_ar) ?: $category->slug.'-ar';
            }
            if (! $category->slug_en) {
                $category->slug_en = Str::slug($category->name_en) ?: $category->slug;
            }
            $category->ensureUniqueSlugs();
        });

        static::updating(function (self $category) {
            $changed = false;
            if ($category->isDirty('name_en') && ! $category->isDirty('slug_en')) {
                $category->slug_en = Str::slug($category->name_en);
                $changed = true;
            }
            if ($category->isDirty('name_ar') && ! $category->isDirty('slug_ar')) {
                $category->slug_ar = Str::slug($category->name_ar) ?: $category->slug_en.'-ar';
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
