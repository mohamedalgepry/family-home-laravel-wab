<?php

namespace App\Domain\Listings\Models;

use App\Domain\Listings\Services\ListingService;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Project extends Model
{
    protected $fillable = [
        'user_id', 'area_id', 'name', 'name_ar', 'name_en', 'slug', 'slug_ar', 'slug_en', 'description', 'description_ar', 'description_en', 'alt_text',
        'video_url', 'map_embed_url', 'location_address_ar', 'location_address_en',
        'keywords_ar', 'keywords_en', 'meta_description_ar', 'meta_description_en', 'is_active', 'auto_delete_at', 'views_count',
        'payment_method', 'down_payment', 'installment_years', 'finishing_type_id',
    ];

    public function resolveRouteBinding($value, $field = null)
    {
        if ($field) {
            return $this->where($field, $value)->firstOrFail();
        }

        return $this->where('slug', $value)
            ->orWhere('slug_ar', $value)
            ->orWhere('slug_en', $value)
            ->orWhere('id', (int) $value)
            ->firstOrFail();
    }

    protected function casts(): array
    {
        return [
            'keywords_ar' => 'array',
            'keywords_en' => 'array',
            'is_active' => 'boolean',
            'auto_delete_at' => 'datetime',
            'views_count' => 'integer',
        ];
    }

    protected $appends = ['location_address', 'meta_description', 'keywords'];

    public function getNameAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? ($this->name_ar ?? $value) : ($this->name_en ?? $value);
    }

    public function getDescriptionAttribute($value)
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? ($this->description_ar ?? $value) : ($this->description_en ?? $value);
    }

    public function getLocationAddressAttribute()
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? $this->location_address_ar : $this->location_address_en;
    }

    public function getMetaDescriptionAttribute()
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? $this->meta_description_ar : $this->meta_description_en;
    }

    public function getKeywordsAttribute()
    {
        $locale = app()->getLocale();

        return $locale === 'ar' ? ($this->keywords_ar ?? []) : ($this->keywords_en ?? []);
    }

    protected static function booted(): void
    {
        static::creating(function (self $project) {
            if (! $project->slug) {
                $project->slug = Str::slug($project->name_en ?: $project->name);
            }
            if (! $project->slug_ar) {
                $project->slug_ar = Str::slug($project->name_ar ?: $project->name) ?: $project->slug.'-ar';
            }
            if (! $project->slug_en) {
                $project->slug_en = Str::slug($project->name_en ?: $project->name) ?: $project->slug;
            }
            $project->ensureUniqueSlugs();
        });

        static::updating(function (self $project) {
            $changed = false;
            if ($project->isDirty('name_en') && ! $project->isDirty('slug_en')) {
                $project->slug_en = Str::slug($project->name_en);
                $changed = true;
            }
            if ($project->isDirty('name_ar') && ! $project->isDirty('slug_ar')) {
                $project->slug_ar = Str::slug($project->name_ar) ?: $project->slug_en.'-ar';
                $changed = true;
            }
            if ($changed) {
                $project->ensureUniqueSlugs();
            }
        });

        static::saved(function () {
            try {
                app(ListingService::class)->clearCache();
            } catch (\Throwable $e) {
            }
        });

        static::deleted(function () {
            try {
                app(ListingService::class)->clearCache();
            } catch (\Throwable $e) {
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

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class);
    }

    public function features()
    {
        return $this->belongsToMany(Feature::class);
    }

    public function finishingType()
    {
        return $this->belongsTo(FinishingType::class, 'finishing_type_id');
    }
}
