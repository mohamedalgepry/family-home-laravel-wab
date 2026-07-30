<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class ListingService
{
    private const CACHE_TTL = 300;

    private const CACHE_PREFIX = 'listing_';

    private const VERSION_KEY = 'listing_cache_version';

    private function version(): int
    {
        return Cache::rememberForever(self::VERSION_KEY, fn () => 1);
    }

    private function generateCacheKey(string $prefix, array $filters, int $perPage, int $page): string
    {
        $hash = md5(serialize($filters)."_{$perPage}_page_{$page}");

        return self::CACHE_PREFIX."{$prefix}_{$hash}_v{$this->version()}";
    }

    public function getFeaturedUnits(int $limit = 8): Paginator
    {
        $page = request()->input('page', 1);

        return Cache::remember(self::CACHE_PREFIX."featured_{$limit}_page_{$page}_v{$this->version()}", self::CACHE_TTL, function () use ($limit) {
            return Unit::featured()
                ->with(['type', 'area', 'images'])
                ->simplePaginate($limit);
        });
    }

    public function getLatestUnits(int $limit = 12): Paginator
    {
        $page = request()->input('page', 1);

        return Cache::remember(self::CACHE_PREFIX."latest_{$limit}_page_{$page}_v{$this->version()}", self::CACHE_TTL, function () use ($limit) {
            return Unit::active()
                ->with(['type', 'area', 'images'])
                ->orderByDesc('priority_points')
                ->orderByDesc('is_pinned')
                ->orderByDesc('created_at')
                ->simplePaginate($limit);
        });
    }

    public function getUnitsByFilters(array $filters, int $perPage = 12): Paginator
    {
        $page = request()->input('page', 1);
        $key = $this->generateCacheKey('units_filters', $filters, $perPage, $page);

        return Cache::remember($key, self::CACHE_TTL, function () use ($filters, $perPage) {
            $query = Unit::active()->with(['type', 'area', 'images']);
            $this->applyUnitFilters($query, $filters);

            return $query->orderByDesc('priority_points')
                ->orderByDesc('is_pinned')
                ->orderByDesc('created_at')
                ->simplePaginate($perPage);
        });
    }

    private function applyUnitFilters($query, array $filters): void
    {
        $exactMatches = ['area_id', 'type_id', 'transaction', 'payment_method', 'finishing_type_id'];

        foreach ($exactMatches as $field) {
            if (! empty($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }

        if (! empty($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }

        if (! empty($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        if (! empty($filters['size_min'])) {
            $query->where('size', '>=', $filters['size_min']);
        }

        if (! empty($filters['size_max'])) {
            $query->where('size', '<=', $filters['size_max']);
        }

        if (! empty($filters['is_deal'])) {
            $query->where('is_deal', true);
        }

        $this->applyFeaturesFilter($query, $filters);
        $this->applySearchFilter($query, $filters, true);
    }

    public function getProjectsByFilters(array $filters, int $perPage = 12): Paginator
    {
        $page = request()->input('page', 1);
        $key = $this->generateCacheKey('projects_filters', $filters, $perPage, $page);

        return Cache::remember($key, self::CACHE_TTL, function () use ($filters, $perPage) {
            $query = Project::where('is_active', true)
                ->with('area', 'images')
                ->withCount(['units' => function ($q) {
                    $q->active();
                }]);

            $this->applyProjectFilters($query, $filters);

            return $query->orderByDesc('created_at')->simplePaginate($perPage);
        });
    }

    private function applyProjectFilters($query, array $filters): void
    {
        $exactMatches = ['area_id', 'payment_method', 'finishing_type_id'];

        foreach ($exactMatches as $field) {
            if (! empty($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }

        $this->applyFeaturesFilter($query, $filters);
        $this->applySearchFilter($query, $filters, false);
    }

    private function applyFeaturesFilter($query, array $filters): void
    {
        if (! empty($filters['features']) && is_array($filters['features'])) {
            $featureIds = array_map('intval', $filters['features']);
            $query->whereHas('features', function ($q) use ($featureIds) {
                $q->whereIn('features.id', $featureIds);
            });
        }
    }

    private function applySearchFilter($query, array $filters, bool $isUnit): void
    {
        if (! empty($filters['search']) && strlen($filters['search']) >= 2) {
            $query->where(function ($q) use ($filters, $isUnit) {
                $q->where('name_en', 'like', '%'.$filters['search'].'%')
                    ->orWhere('name_ar', 'like', '%'.$filters['search'].'%')
                    ->orWhere('description_en', 'like', '%'.$filters['search'].'%')
                    ->orWhere('description_ar', 'like', '%'.$filters['search'].'%')
                    ->orWhere('slug', 'like', '%'.$filters['search'].'%')
                    ->orWhere('slug_ar', 'like', '%'.$filters['search'].'%')
                    ->orWhere('slug_en', 'like', '%'.$filters['search'].'%');

                $relation = $isUnit ? 'project' : 'units';
                $q->orWhereHas($relation, function ($rel) use ($filters) {
                    $rel->where('name_en', 'like', '%'.$filters['search'].'%')
                        ->orWhere('name_ar', 'like', '%'.$filters['search'].'%');
                });
            });
        }
    }

    public function getUnitBySlug(string $slug): ?Unit
    {
        return Cache::remember(self::CACHE_PREFIX."unit_{$slug}_v{$this->version()}", self::CACHE_TTL, function () use ($slug) {
            return Unit::where(function ($query) use ($slug) {
                $query->where('slug', $slug)
                    ->orWhere('slug_ar', $slug)
                    ->orWhere('slug_en', $slug);
            })
                ->with(['type', 'area', 'images', 'user.profile', 'project', 'features', 'finishingType'])
                ->first();
        });
    }

    public function getProjectBySlug(string $slug): ?Project
    {
        return Cache::remember(self::CACHE_PREFIX."project_{$slug}_v{$this->version()}", self::CACHE_TTL, function () use ($slug) {
            return Project::where(function ($query) use ($slug) {
                $query->where('slug', $slug)
                    ->orWhere('slug_ar', $slug)
                    ->orWhere('slug_en', $slug);
            })
                ->with(['area', 'images', 'user.profile', 'features', 'finishingType', 'units' => function ($q) {
                    $q->active()->with(['type', 'area', 'images']);
                }])
                ->first();
        });
    }

    public function getSimilarUnits(Unit $unit, int $limit = 4): Collection
    {
        return Cache::remember(self::CACHE_PREFIX."similar_{$unit->id}_{$limit}_v{$this->version()}", self::CACHE_TTL, function () use ($unit, $limit) {
            return Unit::active()
                ->where('id', '!=', $unit->id)
                ->where(function ($q) use ($unit) {
                    $q->where('type_id', $unit->type_id)
                        ->orWhere('area_id', $unit->area_id);
                })
                ->with(['type', 'area', 'images'])
                ->orderByDesc('priority_points')
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get();
        });
    }

    public function clearCache(): void
    {
        Cache::increment(self::VERSION_KEY);
    }
}
