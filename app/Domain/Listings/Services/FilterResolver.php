<?php

namespace App\Domain\Listings\Services;

class FilterResolver
{
    public function __construct(
        private readonly SmartSearchService $smartSearchService
    ) {}

    /**
     * Resolves final filters by merging explicit user filters with smart filters extracted from the search query.
     * Explicit filters ALWAYS override smart filters.
     */
    public function resolve(array $requestFilters): array
    {
        if (empty($requestFilters['search'])) {
            return $requestFilters;
        }

        $parsed = $this->smartSearchService->parse($requestFilters['search']);
        $smartFilters = $parsed->filters;

        // Explicit filters (provided by user dropdowns/inputs)
        $explicitFilters = array_filter($requestFilters, function ($value, $key) {
            // "search" is not a filter that overrides smart filters, it's the source.
            // Also ignore empty values (null, '')
            return $key !== 'search' && $value !== null && $value !== '';
        }, ARRAY_FILTER_USE_BOTH);

        // Merge: Smart Filters first, then Explicit Filters overwrite them
        $finalFilters = array_merge($smartFilters, $explicitFilters);

        // Replace 'search' with 'clean_query' so the DB text search only searches the remainder of the text
        if (!empty($parsed->cleanQuery)) {
            $finalFilters['search'] = $parsed->cleanQuery;
        } else {
            // If the query was fully parsed (e.g. "للبيع" -> transaction=sale, clean_query=""), we should unset search
            // so we don't query LIKE "% %".
            unset($finalFilters['search']);
        }

        // We can attach the parsed object to the final filters for debugging or UI display if needed
        $finalFilters['_parsed'] = $parsed->toArray();

        return $finalFilters;
    }
}
