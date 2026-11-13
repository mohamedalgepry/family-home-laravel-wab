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

    public const CACHE_VERSION_KEY = 'listing_cache_version_v3';

    /**
     * Public sort codes mapped to [column, direction].
     * The columns are validated again by ListingQueryBuilder::applySort()'s allowlist.
     */
    private const UNIT_SORT_MAP = [
        'newest' => ['created_at', 'desc'],
        'price_asc' => ['price', 'asc'],
        'price_desc' => ['price', 'desc'],
        'size_desc' => ['area_sqm', 'desc'],
    ];

    private const UNIT_SORTABLE = ['created_at', 'price', 'area_sqm'];

    public function version(): int
    {
        return Cache::rememberForever(self::CACHE_VERSION_KEY, fn () => 2);
    }

    private function locale(): string
    {
        return app()->getLocale() ?: 'ar';
    }

    private function generateCacheKey(string $prefix, array $filters, int $perPage, int $page): string
    {
        $hash = md5(serialize($filters)."_{$perPage}_page_{$page}_{$this->locale()}");

        return self::CACHE_PREFIX."{$prefix}_{$hash}_v{$this->version()}";
    }

    public function getFeaturedUnits(int $limit = 8, string $pageName = 'featured_page'): Paginator
    {
        $page = request()->input($pageName, 1);

        return Cache::remember(self::CACHE_PREFIX."featured_{$limit}_{$pageName}_{$page}_{$this->locale()}_v{$this->version()}", self::CACHE_TTL, function () use ($limit, $pageName) {
            return Unit::featured()
                ->with(['type', 'area', 'user'])
                ->withCardImage()
                ->paginate($limit, ['*'], $pageName);
        });
    }

    public function getLatestUnits(int $limit = 12, string $pageName = 'latest_units_page'): Paginator
    {
        $page = request()->input($pageName, 1);

        return Cache::remember(self::CACHE_PREFIX."latest_{$limit}_{$pageName}_{$page}_{$this->locale()}_v{$this->version()}", self::CACHE_TTL, function () use ($limit, $pageName) {
            return $this->unitBaseQuery()
                ->orderByFeatured()
                ->paginate($limit, ['*'], $pageName);
        });
    }

    public function getUnitsByFilters(array $filters, int $perPage = 12): Paginator
    {
        $page = request()->input('page', 1);
        $key = $this->generateCacheKey('units_filters', $filters, $perPage, $page);

        return Cache::remember($key, self::CACHE_TTL, function () use ($filters, $perPage) {
            $query = $this->unitBaseQuery();
            $this->applyUnitFilters($query, $filters);

            if (! $this->applyUnitSort($query, $filters)) {
                $query->orderByFeatured();
            }

            return $query->paginate($perPage);
        });
    }

    private function unitBaseQuery(): Builder
    {
        return Unit::active()->with(['type', 'area', 'finishingType', 'user.profile'])->withCardImage();
    }

    private function applyUnitFilters($query, array $filters): void
    {
        ListingQueryBuilder::applyExactMatches($query, $filters, ['area_id', 'type_id', 'transaction', 'payment_method', 'finishing_type_id', 'rooms', 'bathrooms']);
        ListingQueryBuilder::applyRange($query, $filters, 'price', 'price_min', 'price_max');
        ListingQueryBuilder::applyRange($query, $filters, 'area_sqm', 'size_min', 'size_max');

        if (! empty($filters['is_deal'])) {
            $query->where('is_deal', true);
        }

        $this->applyFeaturesFilter($query, $filters);
        ListingQueryBuilder::applySearch($query, $filters, ['name_en', 'name_ar', 'description_en', 'description_ar', 'slug', 'slug_ar', 'slug_en', 'keywords_ar', 'keywords_en'], 'project', 2);
    }

    public function getProjectsByFilters(array $filters, int $perPage = 12): Paginator
    {
        $page = request()->input('page', 1);
        $key = $this->generateCacheKey('projects_filters', $filters, $perPage, $page);

        return Cache::remember($key, self::CACHE_TTL, function () use ($filters, $perPage) {
            $query = Project::where('is_active', true)
                ->with(['area', 'user.profile'])
                ->withCardImage()
                ->withCount(['units' => function ($q) {
                    $q->active();
                }]);

            $this->applyProjectFilters($query, $filters);

            return $query->orderByDesc('created_at')->paginate($perPage);
        });
    }

    public function getLatestProjects(int $limit = 8, string $pageName = 'latest_projects_page'): Paginator
    {
        $page = request()->input($pageName, 1);

        return Cache::remember(self::CACHE_PREFIX."latest_projects_{$limit}_{$pageName}_{$page}_{$this->locale()}_v{$this->version()}", self::CACHE_TTL, function () use ($limit, $pageName) {
            return Project::where('is_active', true)
                ->with(['area', 'user.profile'])
                ->withCardImage()
                ->withCount(['units' => function ($q) {
                    $q->active();
                }])
                ->orderByDesc('created_at')
                ->paginate($limit, ['*'], $pageName);
        });
    }

    private function applyProjectFilters($query, array $filters): void
    {
        ListingQueryBuilder::applyExactMatches($query, $filters, ['area_id', 'payment_method', 'finishing_type_id']);

        $this->applyFeaturesFilter($query, $filters);
        ListingQueryBuilder::applySearch($query, $filters, ['name_en', 'name_ar', 'description_en', 'description_ar', 'slug', 'slug_ar', 'slug_en', 'keywords_ar', 'keywords_en'], 'units', 2);
    }

    /**
     * Applies a public sort code (newest, price_asc, price_desc, size_desc).
     * Returns false when no valid code was supplied so the caller keeps the featured order.
     */
    private function applyUnitSort(Builder $query, array $filters): bool
    {
        $code = $filters['sort'] ?? null;

        // Guard against array input (e.g. sort[]=...) so the lookup can never raise a TypeError.
        if (! is_string($code) || ! isset(self::UNIT_SORT_MAP[$code])) {
            return false;
        }

        [$column, $direction] = self::UNIT_SORT_MAP[$code];

        $applied = ListingQueryBuilder::applySort(
            $query,
            ['sort' => $column, 'direction' => $direction],
            self::UNIT_SORTABLE,
        );

        if ($applied) {
            $query->orderBy('id');
        }

        return $applied;
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
        return Cache::remember(self::CACHE_PREFIX."unit_{$slug}_{$this->locale()}_v{$this->version()}", self::CACHE_TTL, function () use ($slug) {
            return Unit::byAnySlug($slug)
                ->with(['type', 'area', 'user.profile', 'project.area', 'features', 'finishingType'])
                ->withCardImage()
                ->first();
        });
    }

    public function getProjectBySlug(string $slug): ?Project
    {
        return Cache::remember(self::CACHE_PREFIX."project_{$slug}_{$this->locale()}_v{$this->version()}", self::CACHE_TTL, function () use ($slug) {
            return Project::byAnySlug($slug)
                ->with(['area', 'user.profile', 'features', 'finishingType'])
                ->withCardImage()
                ->withCount(['units' => function ($q) {
                    $q->active();
                }])
                ->first();
        });
    }

    public function getSimilarUnits(Unit $unit, int $limit = 4): Collection
    {
        return Cache::remember(self::CACHE_PREFIX."similar_{$unit->id}_{$limit}_{$this->locale()}_v{$this->version()}", self::CACHE_TTL, function () use ($unit, $limit) {
            return Unit::active()
                ->where('id', '!=', $unit->id)
                ->where(function ($q) use ($unit) {
                    $q->where('type_id', $unit->type_id)
                        ->orWhere('area_id', $unit->area_id);
                })
                ->with(['type', 'area', 'finishingType', 'user.profile'])
                ->withCardImage()
                ->orderByFeatured()
                ->limit($limit)
                ->get();
        });
    }

    public function clearCache(): void
    {
        try {
            $bumped = Cache::lock('listing_cache_version_lock', 5)->get(function () {
                Cache::increment(self::CACHE_VERSION_KEY);

                return true;
            });

            // A busy lock means another writer is already bumping the version,
            // but the version must still move forward on every write so no reader
            // keeps serving stale listings under the previous version key.
            if ($bumped === false) {
                Cache::increment(self::CACHE_VERSION_KEY);
            }
        } catch (\Throwable) {
            Cache::increment(self::CACHE_VERSION_KEY);
        }
    }
}
