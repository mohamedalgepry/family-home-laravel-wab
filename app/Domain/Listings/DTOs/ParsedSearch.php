<?php

namespace App\Domain\Listings\DTOs;

class ParsedSearch
{
    public function __construct(
        public string $originalQuery,
        public string $cleanQuery,
        public array $filters,
        public array $matchedTerms
    ) {}

    public function toArray(): array
    {
        return [
            'original_query' => $this->originalQuery,
            'clean_query' => $this->cleanQuery,
            'filters' => $this->filters,
            'matched_terms' => $this->matchedTerms,
        ];
    }
}
