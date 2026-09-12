<?php

namespace App\Domain\Listings\Services;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\Models\PopularSearch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class SearchService
{
    public const CACHE_VERSION_KEY = 'popular_searches_version';

    public function getPopularSearches(int $limit = 10, int $days = 30): Collection
    {
        $version = Cache::get(self::CACHE_VERSION_KEY, 1);

        return Cache::remember(
            "popular_searches_{$limit}_{$days}_v{$version}",
            600,
            fn () => PopularSearch::where('last_searched_at', '>=', now()->subDays($days))
                ->orderByDesc('search_count')
                ->limit($limit)
                ->get(['keyword', 'search_count'])
        );
    }

    public function recordSearch(string $keyword): void
    {
        $keyword = Sanitizer::text($keyword);
        $keyword = mb_strtolower($keyword);

        if (empty($keyword)) {
            return;
        }

        $record = function () use ($keyword) {
            try {
                PopularSearch::upsert(
                    [
                        ['keyword' => $keyword, 'search_count' => 1, 'last_searched_at' => now()],
                    ],
                    ['keyword'],
                    ['search_count' => \Illuminate\Support\Facades\DB::raw('search_count + 1'), 'last_searched_at']
                );

                // Debounce cache version invalidation: update version at most once every 300 seconds
                if (!Cache::has('popular_searches_debounce')) {
                    Cache::put('popular_searches_debounce', true, 300);
                    Cache::increment(self::CACHE_VERSION_KEY);
                }
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Failed to record popular search: ' . $e->getMessage());
            }
        };

        if (app()->runningInConsole()) {
            $record();
        } else {
            dispatch($record)->afterResponse();
        }
    }
}
