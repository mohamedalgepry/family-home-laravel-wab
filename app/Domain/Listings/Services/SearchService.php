<?php

namespace App\Domain\Listings\Services;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\Models\PopularSearch;
use Illuminate\Database\Eloquent\Collection;

class SearchService
{
    public function getPopularSearches(int $limit = 10, int $days = 30): Collection
    {
        return PopularSearch::where('last_searched_at', '>=', now()->subDays($days))
            ->orderByDesc('search_count')
            ->limit($limit)
            ->get(['keyword', 'search_count']);
    }

    public function recordSearch(string $keyword): void
    {
        $keyword = Sanitizer::text($keyword);
        $keyword = mb_strtolower($keyword);

        if (empty($keyword)) {
            return;
        }

        PopularSearch::updateOrCreate(
            ['keyword' => $keyword],
            [
                'search_count' => \DB::raw('search_count + 1'),
                'last_searched_at' => now(),
            ]
        );
    }
}
