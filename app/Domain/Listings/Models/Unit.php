<?php

namespace App\Domain\Listings\Models;

use App\Domain\Common\Concerns\ByAnySlug;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Unit extends Model
{
    use ByAnySlug;

    protected $fillable = [
        'project_id', 'user_id', 'name', 'name_ar', 'name_en', 'slug', 'slug_ar', 'slug_en', 'description', 'description_ar', 'description_en', 'type_id',
        'area_id', 'transaction', 'price', 'area_sqm', 'rooms', 'bathrooms',
        'floor', 'alt_text', 'video_url', 'video_path', 'map_embed_url',
        'location_address_ar', 'location_address_en', 'keywords_ar', 'keywords_en', 'meta_description_ar', 'meta_description_en',
        'priority_points', 'is_pinned', 'is_deal', 'is_active', 'views_count',
        'auto_delete_at', 'payment_method', 'down_payment', 'installment_years', 'finishing_type_id',
    ];

    protected function casts(): array
    {
        return [
            'keywords_ar' => 'array',
            'keywords_en' => 'array',
            'price' => 'decimal:2',
            'area_sqm' => 'decimal:2',
            'is_pinned' => 'boolean',
            'is_deal' => 'boolean',
            'is_active' => 'boolean',
            'views_count' => 'integer',
            'priority_points' => 'integer',
            'auto_delete_at' => 'datetime',
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
        static::creating(function (self $unit) {
            if (! $unit->slug) {
                $unit->slug = Str::slug($unit->name_en ?: $unit->name);
            }
            if (! $unit->slug_ar) {
                $unit->slug_ar = Str::slug($unit->name_ar ?: $unit->name) ?: $unit->slug.'-ar';
            }
            if (! $unit->slug_en) {
                $unit->slug_en = Str::slug($unit->name_en ?: $unit->name) ?: $unit->slug;
            }
            $unit->ensureUniqueSlugs();
        });

        static::updating(function (self $unit) {
            $changed = false;
            if ($unit->isDirty('name_en') && ! $unit->isDirty('slug_en')) {
                $unit->slug_en = Str::slug($unit->name_en);
                $changed = true;
            }
            if ($unit->isDirty('name_ar') && ! $unit->isDirty('slug_ar')) {
                $unit->slug_ar = Str::slug($unit->name_ar) ?: $unit->slug_en.'-ar';
                $changed = true;
            }
            if ($changed) {
                $unit->ensureUniqueSlugs();
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

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function type()
    {
        return $this->belongsTo(UnitType::class, 'type_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function images()
    {
        return $this->hasMany(UnitImage::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function pointsTransactions()
    {
        return $this->hasMany(PointsTransaction::class);
    }

    public function features()
    {
        return $this->belongsToMany(Feature::class);
    }

    public function finishingType()
    {
        return $this->belongsTo(FinishingType::class, 'finishing_type_id');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderByFeatured();
    }

    public function scopeOrderByFeatured(Builder $query): Builder
    {
        return $query->orderByDesc('priority_points')
            ->orderByDesc('is_pinned')
            ->orderByDesc('created_at');
    }

    public function scopeDeals(Builder $query): Builder
    {
        return $query->where('is_active', true)->where('is_deal', true);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
