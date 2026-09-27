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

    /**
     * Common natural-language aliases. They are resolved against the existing
     * lookup records, so no database IDs are hard-coded.
     */
    private const UNIT_TYPE_ALIASES = [
        'شقق' => ['شقه', 'apartment'],
        'شقق سكنيه' => ['شقه', 'apartment'],
        'فلل' => ['فيلا', 'villa'],
        'فيلات' => ['فيلا', 'villa'],
        'تاون هاوس' => ['تاون هاوس', 'town house', 'townhouse'],
        'توين هاوس' => ['توين هاوس', 'twin house'],
        'بنت هاوس' => ['بنت هاوس', 'penthouse'],
        'استوديو' => ['استوديو', 'studio'],
        'شاليهات' => ['شاليه', 'chalet'],
        'اداري' => ['اداري', 'office'],
        'مكاتب' => ['مكتب', 'office'],
        'محلات' => ['محل', 'shop', 'retail'],
    ];

    private const AREA_ALIASES = [
        'العاصمه' => ['العاصمه'],
        'بالعاصمه' => ['العاصمه'],
        'العاصمه الاداريه' => ['العاصمه', 'اداريه'],
        'بالعاصمه الاداريه' => ['العاصمه', 'اداريه'],
        'العاصمه الجديده' => ['العاصمه', 'جديده'],
        'بالعاصمه الجديده' => ['العاصمه', 'جديده'],
        'new capital' => ['new capital'],
        'administrative capital' => ['administrative capital'],
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

        $priceResult = $this->priceParser->parse($cleanQuery);
        if ($priceResult) {
            if (isset($priceResult['price_min'])) {
                $filters['price_min'] = $priceResult['price_min'];
            }
            if (isset($priceResult['price_max'])) {
                $filters['price_max'] = $priceResult['price_max'];
            }

            $matchedTerms['price'] = $priceResult['matched_term'];
            $cleanQuery = $this->normalizer->normalize(
                str_replace($priceResult['matched_term'], ' ', $cleanQuery)
            );
        }

        foreach (self::TRANSACTION_MAP as $transaction => $keywords) {
            foreach ($keywords as $keyword) {
                $keyword = $this->normalizer->normalize($keyword);

                if ($this->containsPhrase($cleanQuery, $keyword)) {
                    $filters['transaction'] = $transaction;
                    $matchedTerms['transaction'] = $keyword;
                    $cleanQuery = $this->removePhrase($cleanQuery, $keyword);
                    break 2;
                }
            }
        }

        // First use exact database names; this preserves the existing behavior.
        $unitTypes = $this->getUnitTypesSortedByLength();
        foreach ($unitTypes as $type) {
            foreach ($this->lookupNames($type->name_ar, $type->name_en) as $name) {
                if ($this->containsPhrase($cleanQuery, $name)) {
                    $filters['type_id'] = $type->id;
                    $matchedTerms['unit_type'] = $name;
                    $cleanQuery = $this->removePhrase($cleanQuery, $name);
                    break 2;
                }
            }
        }

        // Then resolve common plural/natural-language forms such as "شقق" -> "شقة".
        foreach (self::UNIT_TYPE_ALIASES as $alias => $targets) {
            $alias = $this->normalizer->normalize($alias);

            if (! $this->containsPhrase($cleanQuery, $alias)) {
                continue;
            }

            $type = $this->findUnitTypeByAliases($targets, $unitTypes);
            if ($type) {
                $filters['type_id'] = $type->id;
                $matchedTerms['unit_type'] = $alias;
                $cleanQuery = $this->removePhrase($cleanQuery, $alias);
                break;
            }
        }

        // Exact database area names remain the first choice.
        $areas = $this->getAreasSortedByLength();
        foreach ($areas as $area) {
            foreach ($this->lookupNames($area->name_ar, $area->name_en) as $name) {
                if ($this->containsPhrase($cleanQuery, $name)) {
                    $filters['area_id'] = $area->id;
                    $matchedTerms['area'] = $name;
                    $cleanQuery = $this->removePhrase($cleanQuery, $name);
                    break 2;
                }
            }
        }

        // Resolve natural phrases such as "بالعاصمة" against the existing Area records.
        foreach (self::AREA_ALIASES as $alias => $tokens) {
            $alias = $this->normalizer->normalize($alias);

            if (! $this->containsPhrase($cleanQuery, $alias)) {
                continue;
            }

            $area = $this->findAreaByAliases($tokens, $areas);
            if ($area) {
                $filters['area_id'] = $area->id;
                $matchedTerms['area'] = $alias;
                $cleanQuery = $this->removePhrase($cleanQuery, $alias);
                break;
            }
        }

        return new ParsedSearch(
            originalQuery: $originalQuery,
            cleanQuery: $cleanQuery,
            filters: $filters,
            matchedTerms: $matchedTerms
        );
    }

    private function lookupNames(?string $nameAr, ?string $nameEn): array
    {
        return array_values(array_filter([
            $this->normalizer->normalize((string) $nameAr),
            $this->normalizer->normalize((string) $nameEn),
        ]));
    }

    private function containsPhrase(string $haystack, string $needle): bool
    {
        if ($needle === '') {
            return false;
        }

        return preg_match('/(?<![\p{L}\p{N}])' . preg_quote($needle, '/') . '(?![\p{L}\p{N}])/u', $haystack) === 1;
    }

    private function removePhrase(string $text, string $phrase): string
    {
        $text = preg_replace(
            '/(?<![\p{L}\p{N}])' . preg_quote($phrase, '/') . '(?![\p{L}\p{N}])/u',
            ' ',
            $text
        );

        return $this->normalizer->normalize($text ?? '');
    }

    private function findUnitTypeByAliases(array $targets, $unitTypes): ?UnitType
    {
        $targets = array_values(array_filter(array_map(
            fn ($target) => $this->normalizer->normalize($target),
            $targets
        )));

        // Prefer exact canonical names over broad "contains" matches.
        foreach ($unitTypes as $type) {
            $names = $this->lookupNames($type->name_ar, $type->name_en);
            if (array_intersect($names, $targets)) {
                return $type;
            }
        }

        foreach ($unitTypes as $type) {
            $names = $this->lookupNames($type->name_ar, $type->name_en);
            foreach ($names as $name) {
                foreach ($targets as $target) {
                    if ($target !== '' && str_contains($name, $target)) {
                        return $type;
                    }
                }
            }
        }

        return null;
    }

    private function findAreaByAliases(array $tokens, $areas): ?Area
    {
        $tokens = array_values(array_filter(array_map(
            fn ($token) => $this->normalizer->normalize($token),
            $tokens
        )));

        if (empty($tokens)) {
            return null;
        }

        $candidates = collect($areas)->filter(function ($area) use ($tokens) {
            $names = $this->lookupNames($area->name_ar, $area->name_en);

            foreach ($names as $name) {
                $allMatch = true;
                foreach ($tokens as $token) {
                    if (! str_contains($name, $token)) {
                        $allMatch = false;
                        break;
                    }
                }

                if ($allMatch) {
                    return true;
                }
            }

            return false;
        });

        return $candidates->sortByDesc(function ($area) {
            return mb_strlen((string) $area->name_ar) + mb_strlen((string) $area->name_en);
        })->first();
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
