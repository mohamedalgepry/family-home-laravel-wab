<?php

namespace App\Domain\Listings\Services;

class SearchNormalizer
{
    /**
     * Normalize Arabic text for robust searching.
     * Normalizes Alefs, Taa Marbuta/Haa, Yaa/Alef Maksura.
     * Removes diacritics (Tashkeel) and standardizes spacing.
     */
    public function normalize(string $text): string
    {
        if (empty(trim($text))) {
            return '';
        }

        // 1. Remove diacritics (Tashkeel)
        $text = preg_replace('/[\x{0617}-\x{061A}\x{064B}-\x{0652}]/u', '', $text);

        // 2. Normalize Alefs (أ، إ، آ) to plain Alef (ا)
        $text = preg_replace('/[أإآ]/u', 'ا', $text);

        // 3. Normalize Taa Marbuta (ة) to Haa (ه)
        $text = preg_replace('/ة/u', 'ه', $text);

        // 4. Normalize Alef Maksura (ى) to Yaa (ي)
        $text = preg_replace('/ى/u', 'ي', $text);

        // 5. Remove Tatweel (Kashida) (ـ)
        $text = preg_replace('/ـ/u', '', $text);

        // 6. Lowercase English characters
        $text = strtolower($text);

        // 7. Strip punctuation and excessive spaces (keep period for decimals)
        $text = preg_replace('/[^\p{L}\p{N}\.\s]/u', ' ', $text);
        $text = preg_replace('/\s+/u', ' ', $text);

        return trim($text);
    }
}
