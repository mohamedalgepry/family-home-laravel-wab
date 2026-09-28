<?php

namespace App\Domain\Listings\Services;

class SearchNormalizer
{
    /**
     * Normalize Arabic/English text for robust natural-language searching.
     */
    public function normalize(string $text): string
    {
        if (empty(trim($text))) {
            return '';
        }

        $text = preg_replace('/[\x{0617}-\x{061A}\x{064B}-\x{0652}]/u', '', $text);
        $text = preg_replace('/[أإآ]/u', 'ا', $text);
        $text = preg_replace('/ة/u', 'ه', $text);
        $text = preg_replace('/ى/u', 'ي', $text);
        $text = preg_replace('/ـ/u', '', $text);

        // Arabic-Indic and Eastern Arabic-Indic digits -> ASCII digits.
        $text = strtr($text, [
            '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
            '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
            '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4',
            '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
        ]);

        $text = strtolower($text);
        $text = preg_replace('/[^\p{L}\p{N}\.\s]/u', ' ', $text);
        $text = preg_replace('/\s+/u', ' ', $text);

        return trim($text);
    }
}
