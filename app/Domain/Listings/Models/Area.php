<?php

namespace App\Domain\Listings\Models;

use App\Domain\Listings\Services\ListingLookupService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Area extends Model
{
    protected $fillable = [
        'name_ar', 'name_en', 'slug', 'is_active', 'sort_order',
        'meta_title_ar', 'meta_title_en',
        'meta_description_ar', 'meta_description_en',
        'meta_keywords_ar', 'meta_keywords_en',
        'image_path',
        'short_description_ar', 'short_description_en',
        'hero_title_ar', 'hero_title_en',
        'hero_description_ar', 'hero_description_en',
        'hero_image', 'gallery',
        'about_ar', 'about_en',
        'address_ar', 'address_en',
        'latitude', 'longitude', 'map_url',
        'parent_id',
    ];

    protected $appends = ['name'];

    public function getNameAttribute(): string
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? ($this->name_ar ?? $this->name_en ?? '') : ($this->name_en ?? $this->name_ar ?? '');
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'meta_keywords_ar' => 'array',
            'meta_keywords_en' => 'array',
            'gallery' => 'array',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $area) {
            $area->slug = $area->slug ?: Str::slug($area->name_en ?? $area->name_ar);
        });

        static::saved(function () {
            Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        });

        static::deleted(function () {
            Cache::forget(ListingLookupService::CACHE_KEY_AREAS);
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }




    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function features()
    {
        return $this->hasMany(AreaFeature::class);
    }

    public function nearbyPlaces()
    {
        return $this->hasMany(AreaNearbyPlace::class);
    }

    public function faqs()
    {
        return $this->hasMany(AreaFaq::class);
    }
}
