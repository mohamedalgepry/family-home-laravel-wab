<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\DTOs\ParsedSearch;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\UnitType;
use Illuminate\Support\Facades\Cache;

class SmartSearchService
{
    private const TRANSACTION_MAP = [
        'sale' => ['للبيع', 'بيع', 'sale', 'for sale'],
        'rent' => ['ايجار', 'للايجار', 'اجار', 'للاجار', 'rent', 'for rent'],
    ];

    private const PAYMENT_MAP = [
        'both' => ['كاش وتقسيط', 'كاش او تقسيط', 'نقدي وتقسيط', 'cash and installment'],
        'installment' => ['تقسيط', 'اقساط', 'قسط', 'installment', 'installments'],
        'cash' => ['كاش', 'نقدي', 'نقدا', 'cash'],
    ];

    private const UNIT_TYPE_ALIASES = [
        'شقق سكنيه' => ['شقه', 'apartment'],
        'شقق' => ['شقه', 'apartment'],
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
        'بالعاصمه الاداريه' => ['العاصمه', 'اداريه'],
        'العاصمه الاداريه' => ['العاصمه', 'اداريه'],
        'بالعاصمه الجديده' => ['العاصمه', 'جديده'],
        'العاصمه الجديده' => ['العاصمه', 'جديده'],
        'بالعاصمه' => ['العاصمه'],
        'العاصمه' => ['العاصمه'],
        'new administrative capital' => ['new administrative capital'],
        'administrative capital' => ['administrative capital'],
        'new capital' => ['new capital'],
    ];

    private const STOP_WORDS = [
        'في', 'فى', 'من', 'الي', 'الى', 'و', 'او', 'ب', 'بـ', 'مع', 'داخل',
        'قريب', 'قريبه', 'بالقرب', 'عند', 'على', 'عن', 'لل', 'ل', 'عايز',
        'اريد', 'ابحث', 'محتاج', 'شوف', 'هات', 'وحده', 'وحدة', 'عقار',
        'عقارات', 'جنيه', 'جنيه مصري', 'جنيهات', 'egp', 'le', 'unit', 'units', 'property', 'properties', 'for',
    ];

    public function __construct(
        private readonly SearchNormalizer $normalizer,
        private readonly PriceParser $priceParser
    ) {}

    public function parse(string $originalQuery): ParsedSearch
    {
        $cleanQuery = $this->normalizer->normalize($originalQuery);
        $filters = [];
        $matchedTerms = [];

        if ($cleanQuery === '') {
            return new ParsedSearch($originalQuery, '', [], []);
        }

        // Extract structured intent before generic text search.
        $this->extractRooms($cleanQuery, $filters, $matchedTerms);
        $this->extractBathrooms($cleanQuery, $filters, $matchedTerms);
        $this->extractSize($cleanQuery, $filters, $matchedTerms);

        $priceResult = $this->priceParser->parse($cleanQuery);
        if ($priceResult) {
            foreach (['price_min', 'price_max'] as $key) {
                if (isset($priceResult[$key])) {
                    $filters[$key] = $priceResult[$key];
                }
            }
            $matchedTerms['price'] = $priceResult['matched_term'];
            $cleanQuery = $this->removePhrase($cleanQuery, $priceResult['matched_term']);
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

        foreach (self::PAYMENT_MAP as $payment => $keywords) {
            foreach ($keywords as $keyword) {
                $keyword = $this->normalizer->normalize($keyword);
                if ($this->containsPhrase($cleanQuery, $keyword)) {
                    $filters['payment_method'] = $payment;
                    $matchedTerms['payment_method'] = $keyword;
                    $cleanQuery = $this->removePhrase($cleanQuery, $keyword);
                    break 2;
                }
            }
        }

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

        $this->extractFeatures($cleanQuery, $filters, $matchedTerms);

        $finishingTypes = $this->getFinishingTypesSortedByLength();
        foreach ($finishingTypes as $finishing) {
            foreach ($this->lookupNames($finishing->name_ar, $finishing->name_en) as $name) {
                if ($this->containsPhrase($cleanQuery, $name)) {
                    $filters['finishing_type_id'] = $finishing->id;
                    $matchedTerms['finishing'] = $name;
                    $cleanQuery = $this->removePhrase($cleanQuery, $name);
                    break 2;
                }
            }
        }

        $cleanQuery = $this->removeStopWords($cleanQuery);

        return new ParsedSearch(
            originalQuery: $originalQuery,
            cleanQuery: $cleanQuery,
            filters: $filters,
            matchedTerms: $matchedTerms
        );
    }

    private function extractRooms(string &$text, array &$filters, array &$matchedTerms): void
    {
        $pattern = '/(?:من\\s+)?(\\d+)\\s*(?:غرف(?:ه|تين)?|غرف|غرفه|غرفة|rooms?|bedrooms?|beds?)(?:\\s*نوم)?/u';
        if (preg_match($pattern, $text, $matches)) {
            $filters['rooms'] = (int) $matches[1];
            $matchedTerms['rooms'] = $matches[0];
            $text = $this->removePhrase($text, $matches[0]);
            return;
        }

        $wordMap = [
            'غرفتين' => 2,
            'غرفتان' => 2,
            'ثلاث غرف' => 3,
            'ثلاثه غرف' => 3,
            'اربع غرف' => 4,
            'اربعه غرف' => 4,
            'خمس غرف' => 5,
            'خمسه غرف' => 5,
        ];

        foreach ($wordMap as $phrase => $rooms) {
            $phrase = $this->normalizer->normalize($phrase);
            if ($this->containsPhrase($text, $phrase)) {
                $filters['rooms'] = $rooms;
                $matchedTerms['rooms'] = $phrase;
                $text = $this->removePhrase($text, $phrase);
                return;
            }
        }
    }

    private function extractBathrooms(string &$text, array &$filters, array &$matchedTerms): void
    {
        $pattern = '/(?:\\b(\\d+)\\s*(?:حمام|حمامات|bathrooms?|baths?)\\b|\\b(\\d+)\\s*(?:حمام|حمامات|bathrooms?|baths?)\\b)/iu';
        if (preg_match($pattern, $text, $matches)) {
            $value = (int) ($matches[1] !== '' ? $matches[1] : $matches[2]);
            if ($value > 0) {
                $filters['bathrooms'] = $value;
                $matchedTerms['bathrooms'] = $matches[0];
                $text = $this->removePhrase($text, $matches[0]);
                return;
            }
        }

        $wordMap = [
            'حمامين' => 2,
            'حمامان' => 2,
            'ثلاث حمامات' => 3,
            'ثلاثه حمامات' => 3,
            'اربع حمامات' => 4,
            'اربعه حمامات' => 4,
            'خمس حمامات' => 5,
            'خمسه حمامات' => 5,
        ];

        foreach ($wordMap as $phrase => $bathrooms) {
            $phrase = $this->normalizer->normalize($phrase);
            if ($this->containsPhrase($text, $phrase)) {
                $filters['bathrooms'] = $bathrooms;
                $matchedTerms['bathrooms'] = $phrase;
                $text = $this->removePhrase($text, $phrase);
                return;
            }
        }
    }

    private function extractSize(string &$text, array &$filters, array &$matchedTerms): void
    {
        $number = '\\d+(?:\\.\\d+)?';
        $unit = '(?:متر|متر مربع|م2|m2|sqm|square meters?)';

        $rangePattern = '/(?:من\\s+)?(' . $number . ')\\s*' . $unit . '\\s*(?:الي|الى|ل|لحد|و|-)+\\s*(' . $number . ')\\s*' . $unit . '/iu';
        if (preg_match($rangePattern, $text, $matches)) {
            $min = (float) $matches[1];
            $max = (float) $matches[2];
            $filters['size_min'] = min($min, $max);
            $filters['size_max'] = max($min, $max);
            $matchedTerms['size'] = $matches[0];
            $text = $this->removePhrase($text, $matches[0]);
            return;
        }

        $singlePattern = '/(?:مساحه|مساحة|area)?\\s*(' . $number . ')\\s*' . $unit . '/iu';
        if (preg_match($singlePattern, $text, $matches)) {
            $filters['size_min'] = (float) $matches[1];
            $filters['size_max'] = (float) $matches[1];
            $matchedTerms['size'] = $matches[0];
            $text = $this->removePhrase($text, $matches[0]);
        }
    }

    private function removeStopWords(string $text): string
    {
        foreach (self::STOP_WORDS as $word) {
            $word = $this->normalizer->normalize($word);
            if ($word !== '') {
                $text = preg_replace(
                    '/(?<![\\p{L}\\p{N}])' . preg_quote($word, '/') . '(?![\\p{L}\\p{N}])/u',
                    ' ',
                    $text
                ) ?? $text;
            }
        }

        return $this->normalizer->normalize($text);
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

        return preg_match('/(?<![\\p{L}\\p{N}])' . preg_quote($needle, '/') . '(?![\\p{L}\\p{N}])/u', $haystack) === 1;
    }

    private function removePhrase(string $text, string $phrase): string
    {
        $text = preg_replace(
            '/(?<![\\p{L}\\p{N}])' . preg_quote($phrase, '/') . '(?![\\p{L}\\p{N}])/u',
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

    private function extractFeatures(string &$text, array &$filters, array &$matchedTerms): void
    {
        $matchedIds = [];
        $matchedNames = [];

        foreach ($this->getFeaturesSortedByLength() as $feature) {
            foreach ($this->lookupNames($feature->name_ar, $feature->name_en) as $name) {
                if (! $this->containsPhrase($text, $name)) {
                    continue;
                }

                $matchedIds[] = (int) $feature->id;
                $matchedNames[] = $name;
                $text = $this->removePhrase($text, $name);
                break;
            }
        }

        if ($matchedIds !== []) {
            $filters['features'] = array_values(array_unique($matchedIds));
            $matchedTerms['features'] = array_values(array_unique($matchedNames));
        }
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

    private function getFeaturesSortedByLength()
    {
        return Cache::remember('smart_search_features', 3600, function () {
            return Feature::query()->orderBy('id')->get()->sortByDesc(function ($feature) {
                return mb_strlen((string) $feature->name_ar) + mb_strlen((string) $feature->name_en);
            })->values();
        });
    }

    private function getFinishingTypesSortedByLength()
    {
        return Cache::remember('smart_search_finishing_types', 3600, function () {
            return FinishingType::all()->sortByDesc(function ($type) {
                return mb_strlen((string) $type->name_ar) + mb_strlen((string) $type->name_en);
            })->values();
        });
    }
}
