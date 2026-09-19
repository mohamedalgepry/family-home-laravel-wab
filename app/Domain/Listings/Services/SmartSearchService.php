<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\DTOs\ParsedSearch;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\UnitType;
use Illuminate\Support\Facades\Cache;

class SmartSearchService
{
    private const TRANSACTION_MAP = [
        'sale' => ['بيع', 'للبيع', 'sale', 'for sale'],
        'rent' => ['ايجار', 'للايجار', 'rent', 'for rent', 'اجار', 'للاجار'],
    ];

    public function __construct(
        private readonly SearchNormalizer $normalizer,
        private readonly PriceParser $priceParser
    ) {}

    public function parse(string $originalQuery): ParsedSearch
    {
        $normalized = $this->normalizer->normalize($originalQuery);
        $cleanQuery = $normalized;
        $filters = [];
        $matchedTerms = [];

        if (empty($cleanQuery)) {
            return new ParsedSearch($originalQuery, '', [], []);
        }

        // 1. Extract Price
        $priceResult = $this->priceParser->parse($cleanQuery);
        if ($priceResult) {
            if (isset($priceResult['price_min'])) {
                $filters['price_min'] = $priceResult['price_min'];
            }
            if (isset($priceResult['price_max'])) {
                $filters['price_max'] = $priceResult['price_max'];
            }
            
            $matchedTerms['price'] = $priceResult['matched_term'];
            // Remove matched term from clean query
            $cleanQuery = str_replace($priceResult['matched_term'], ' ', $cleanQuery);
            $cleanQuery = $this->normalizer->normalize($cleanQuery); // re-normalize spaces
        }

        // 2. Extract Transaction
        foreach (self::TRANSACTION_MAP as $transaction => $keywords) {
            foreach ($keywords as $keyword) {
                // Must match whole word
                if (preg_match('/\b' . preg_quote($keyword, '/') . '\b/u', $cleanQuery)) {
                    $filters['transaction'] = $transaction;
                    $matchedTerms['transaction'] = $keyword;
                    $cleanQuery = preg_replace('/\b' . preg_quote($keyword, '/') . '\b/u', ' ', $cleanQuery);
                    $cleanQuery = $this->normalizer->normalize($cleanQuery);
                    break 2; // Found a transaction, stop looking
                }
            }
        }

        // 3. Extract Unit Type
        $unitTypes = $this->getUnitTypesSortedByLength();
        foreach ($unitTypes as $type) {
            $nameAr = $this->normalizer->normalize((string) $type->name_ar);
            $nameEn = $this->normalizer->normalize((string) $type->name_en);
            
            foreach (array_filter([$nameAr, $nameEn]) as $name) {
                if (preg_match('/\b' . preg_quote($name, '/') . '\b/u', $cleanQuery)) {
                    $filters['type_id'] = $type->id;
                    $matchedTerms['unit_type'] = $name;
                    $cleanQuery = preg_replace('/\b' . preg_quote($name, '/') . '\b/u', ' ', $cleanQuery);
                    $cleanQuery = $this->normalizer->normalize($cleanQuery);
                    break 2; // Found a type, stop looking
                }
            }
        }

        // 4. Extract Area
        $areas = $this->getAreasSortedByLength();
        foreach ($areas as $area) {
            $nameAr = $this->normalizer->normalize((string) $area->name_ar);
            $nameEn = $this->normalizer->normalize((string) $area->name_en);
            
            foreach (array_filter([$nameAr, $nameEn]) as $name) {
                if (preg_match('/\b' . preg_quote($name, '/') . '\b/u', $cleanQuery)) {
                    $filters['area_id'] = $area->id;
                    $matchedTerms['area'] = $name;
                    $cleanQuery = preg_replace('/\b' . preg_quote($name, '/') . '\b/u', ' ', $cleanQuery);
                    $cleanQuery = $this->normalizer->normalize($cleanQuery);
                    break 2; // Found an area, stop looking
                }
            }
        }

        return new ParsedSearch(
            originalQuery: $originalQuery,
            cleanQuery: $cleanQuery,
            filters: $filters,
            matchedTerms: $matchedTerms
        );
    }

    private function getUnitTypesSortedByLength()
    {
        return Cache::remember('smart_search_unit_types', 3600, function () {
            return UnitType::all()->sortByDesc(function ($type) {
                return mb_strlen((string) $type->name_ar) + mb_strlen((string) $type->name_en);
            })->values();
        });
    }

    private function getAreasSortedByLength()
    {
        return Cache::remember('smart_search_areas', 3600, function () {
            return Area::all()->sortByDesc(function ($area) {
                return mb_strlen((string) $area->name_ar) + mb_strlen((string) $area->name_en);
            })->values();
        });
    }
}
