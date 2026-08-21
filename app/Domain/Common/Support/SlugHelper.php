<?php

namespace App\Domain\Common\Support;

use Illuminate\Support\Str;

class SlugHelper
{
    /**
     * Generate a clean, URL-friendly slug supporting both Arabic (UTF-8) and Latin characters.
     */
    public static function make(?string $title, string $fallback = 'item'): string
    {
        if (! $title || trim($title) === '') {
            return $fallback.'-'.Str::random(6);
        }

        $title = trim($title);

        // Normalize Arabic characters and clean spaces
        // Str::slug with null language preserves Unicode characters (including Arabic)
        $slug = Str::slug($title, '-', null);

        // Remove any unwanted special punctuation while preserving Arabic, English, numbers, and hyphens
        $slug = preg_replace('/[^\p{Arabic}a-zA-Z0-9\-_]+/u', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-_');

        if (empty($slug)) {
            $slug = Str::slug($title, '-', 'en') ?: ($fallback.'-'.Str::random(6));
        }

        return $slug;
    }

    /**
     * Specifically generate an Arabic slug from Arabic text.
     */
    public static function makeArabic(?string $titleAr, ?string $fallback = null): string
    {
        if (! $titleAr || trim($titleAr) === '') {
            return ($fallback ?: 'article').'-ar';
        }

        return self::make($titleAr, $fallback ?: 'article');
    }

    /**
     * Specifically generate an English slug from English text.
     */
    public static function makeEnglish(?string $titleEn, ?string $fallback = null): string
    {
        if (! $titleEn || trim($titleEn) === '') {
            return ($fallback ?: 'article').'-'.Str::random(6);
        }

        $slug = Str::slug($titleEn, '-', 'en');
        if (empty($slug)) {
            $slug = self::make($titleEn, $fallback ?: 'article');
        }

        return $slug;
    }
}
