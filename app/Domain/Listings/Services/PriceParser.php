<?php

namespace App\Domain\Listings\Services;

class PriceParser
{
    private const MULTIPLIERS = [
        'مليون' => 1000000,
        'm' => 1000000,
        'م' => 1000000,
        'الف' => 1000,
        'k' => 1000,
    ];

    /**
     * Parse price constraints from normalized text.
     * Returns an array with 'price_min', 'price_max', and 'matched_term'.
     * Returns null if no price is found.
     */
    public function parse(string $normalizedQuery): ?array
    {
        // 1. Try to match a range first: "من 3 الي 5 مليون"
        $rangePattern = '/\b(?:من|بين)\s+(\d+(?:\.\d+)?)\s*(مليون|الف|m|k|م)?\s+(?:الي|ل|و|لحد)\s+(\d+(?:\.\d+)?)\s*(مليون|الف|m|k|م)\b/u';
        
        if (preg_match($rangePattern, $normalizedQuery, $matches)) {
            $minVal = (float) $matches[1];
            $minMulti = !empty($matches[2]) ? $matches[2] : $matches[4];
            $maxVal = (float) $matches[3];
            $maxMulti = $matches[4];

            $min = $this->applyMultiplier($minVal, $minMulti);
            $max = $this->applyMultiplier($maxVal, $maxMulti);

            return [
                'price_min' => min($min, $max),
                'price_max' => max($min, $max),
                'matched_term' => $matches[0],
            ];
        }

        // 2. Try to match single value with optional prefix
        // Prefixes: اقل من, تحت, حد اقصي, اكثر من, فوق, حد ادني, ب
        $singlePattern = '/\b(اقل من|تحت|حد اقصي|اكثر من|فوق|حد ادني|ب)?\s*(\d+(?:\.\d+)?)\s*(مليون|الف|m|k|م)\b/u';
        
        if (preg_match($singlePattern, $normalizedQuery, $matches)) {
            $prefix = trim($matches[1]);
            $val = (float) $matches[2];
            $multi = $matches[3];

            $price = $this->applyMultiplier($val, $multi);
            
            $result = ['matched_term' => trim($matches[0])];

            if (in_array($prefix, ['اقل من', 'تحت', 'حد اقصي'])) {
                $result['price_max'] = $price;
            } elseif (in_array($prefix, ['اكثر من', 'فوق', 'حد ادني'])) {
                $result['price_min'] = $price;
            } else {
                // If no prefix or just "ب", it usually implies a max budget or exact price. 
                // Typically in real estate search, saying "ب 5 مليون" means "up to 5 million".
                $result['price_max'] = $price;
            }

            return $result;
        }

        return null;
    }

    private function applyMultiplier(float $value, string $multiplier): int
    {
        $multiplier = trim($multiplier);
        $factor = self::MULTIPLIERS[$multiplier] ?? 1;
        
        // Special case: if value > 10,000, we probably don't need a multiplier if it wasn't provided correctly
        // But the regex requires a multiplier to avoid false positives with regular numbers (like 500 in "500 meter")
        
        return (int) ($value * $factor);
    }
}
