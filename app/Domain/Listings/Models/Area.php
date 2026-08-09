<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Area extends Model
{
    protected $fillable = [
        'name_ar', 'name_en', 'slug', 'is_active', 'sort_order',
        'meta_title_ar', 'meta_title_en',
        'meta_description_ar', 'meta_description_en',
        'meta_keywords_ar', 'meta_keywords_en',
        'image_path',
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
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $area) {
            $area->slug = $area->slug ?: Str::slug($area->name_en ?? $area->name_ar);
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSorted($query)
    {
        return $query->orderBy('sort_order')->orderBy('name_en');
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
