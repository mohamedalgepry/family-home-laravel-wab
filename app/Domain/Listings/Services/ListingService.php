<?php

namespace App\Domain\Listings\Services;

use App\Domain\Common\QueryBuilders\ListingQueryBuilder;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class ListingService
{
    private const CACHE_TTL = 300;

    private const CACHE_PREFIX = 'listing_';

    public const CACHE_VERSION_KEY = 'listing_cache_version';

    private function version(): int
    {
        return Cache::rememberForever(self::CACHE_VERSION_KEY, fn () => 1);
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
                ->with(['type', 'area', 'images', 'user.profile'])
                ->paginate($limit);
        });
    }

    public function getLatestUnits(int $limit = 12): Paginator
    {
        $page = request()->input('page', 1);

        return Cache::remember(self::CACHE_PREFIX."latest_{$limit}_page_{$page}_v{$this->version()}", self::CACHE_TTL, function () use ($limit) {
            return $this->unitBaseQuery()
                ->orderByFeatured()
                ->paginate($limit);
        });
    }

    public function getUnitsByFilters(array $filters, int $perPage = 12): Paginator
    {
        $page = request()->input('page', 1);
        $key = $this->generateCacheKey('units_filters', $filters, $perPage, $page);

        return Cache::remember($key, self::CACHE_TTL, function () use ($filters, $perPage) {
            $query = $this->unitBaseQuery();
            $this->applyUnitFilters($query, $filters);

            return $query->orderByFeatured()->paginate($perPage);
        });
    }

    private function unitBaseQuery(): Builder
    {
        return Unit::active()->with(['type', 'area', 'images', 'user.profile', 'project.user.profile']);
    }

    private function applyUnitFilters($query, array $filters): void
    {
        ListingQueryBuilder::applyExactMatches($query, $filters, ['area_id', 'type_id', 'transaction', 'payment_method', 'finishing_type_id']);
        ListingQueryBuilder::applyRange($query, $filters, 'price', 'price_min', 'price_max');
        ListingQueryBuilder::applyRange($query, $filters, 'size', 'size_min', 'size_max');

        if (! empty($filters['is_deal'])) {
            $query->where('is_deal', true);
        }

        $this->applyFeaturesFilter($query, $filters);
        ListingQueryBuilder::applySearch($query, $filters, ['name_en', 'name_ar', 'description_en', 'description_ar', 'slug', 'slug_ar', 'slug_en'], 'project', 2);
    }

    public function getProjectsByFilters(array $filters, int $perPage = 12): Paginator
    {
        $page = request()->input('page', 1);
        $key = $this->generateCacheKey('projects_filters', $filters, $perPage, $page);

        return Cache::remember($key, self::CACHE_TTL, function () use ($filters, $perPage) {
            $query = Project::where('is_active', true)
                ->with('area', 'images', 'user.profile')
                ->withCount(['units' => function ($q) {
                    $q->active();
                }]);

            $this->applyProjectFilters($query, $filters);

            return $query->orderByDesc('created_at')->paginate($perPage);
        });
    }

    public function getLatestProjects(int $limit = 8): Paginator
    {
        $page = request()->input('page', 1);

        return Cache::remember(self::CACHE_PREFIX."latest_projects_{$limit}_page_{$page}_v{$this->version()}", self::CACHE_TTL, function () use ($limit) {
            return Project::where('is_active', true)
                ->with(['area', 'images', 'user.profile'])
                ->withCount(['units' => function ($q) {
                    $q->active();
                }])
                ->orderByDesc('created_at')
                ->paginate($limit);
        });
    }

    private function applyProjectFilters($query, array $filters): void
    {
        ListingQueryBuilder::applyExactMatches($query, $filters, ['area_id', 'payment_method', 'finishing_type_id']);

        $this->applyFeaturesFilter($query, $filters);
        ListingQueryBuilder::applySearch($query, $filters, ['name_en', 'name_ar', 'description_en', 'description_ar', 'slug', 'slug_ar', 'slug_en'], 'units', 2);
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

    public function getUnitBySlug(string $slug): ?Unit
    {
        return Cache::remember(self::CACHE_PREFIX."unit_{$slug}_v{$this->version()}", self::CACHE_TTL, function () use ($slug) {
            return Unit::byAnySlug($slug)
                ->with(['type', 'area', 'images', 'user.profile', 'project', 'features', 'finishingType'])
                ->first();
        });
    }

    public function getProjectBySlug(string $slug): ?Project
    {
        return Cache::remember(self::CACHE_PREFIX."project_{$slug}_v{$this->version()}", self::CACHE_TTL, function () use ($slug) {
            return Project::byAnySlug($slug)
                ->with(['area', 'images', 'user.profile', 'features', 'finishingType', 'units' => function ($q) {
                    $q->active()->with(['type', 'area', 'images'])->limit(24);
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
                ->with(['type', 'area', 'images', 'user.profile'])
                ->orderByFeatured()
                ->limit($limit)
                ->get();
        });
    }

    public function clearCache(): void
    {
        Cache::increment(self::CACHE_VERSION_KEY);
    }
}
