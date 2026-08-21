<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Article;
use Illuminate\Database\QueryException;
use Illuminate\Support\Str;

class CreateArticleAction
{
    private const MAX_SLUG_RETRIES = 10;

    public function execute(CreateArticleData $data): Article
    {
        $raw = $data->toArray();

        $title_ar = isset($raw['title_ar']) ? Sanitizer::text($raw['title_ar']) : null;
        $title_en = isset($raw['title_en']) ? Sanitizer::text($raw['title_en']) : null;
        $title = $title_ar ?: ($title_en ?: '');

        $content_ar = isset($raw['content_ar']) ? Sanitizer::rich($raw['content_ar']) : null;
        $content_en = isset($raw['content_en']) ? Sanitizer::rich($raw['content_en']) : null;
        $content = $content_ar ?: ($content_en ?: '');

        $excerpt_ar = isset($raw['excerpt_ar']) ? Sanitizer::text($raw['excerpt_ar']) : null;
        $excerpt_en = isset($raw['excerpt_en']) ? Sanitizer::text($raw['excerpt_en']) : null;
        $excerpt = $excerpt_ar ?: ($excerpt_en ?: null);

        $slugAr = \App\Domain\Common\Support\SlugHelper::makeArabic($title_ar ?: $title, 'article');
        $slugEn = \App\Domain\Common\Support\SlugHelper::makeEnglish($title_en ?: $title, 'article');
        $slug = $slugEn;

        // Use retry-on-collision instead of check-then-insert to handle
        // concurrent inserts safely. The UNIQUE index is the final authority.
        $lastException = null;
        for ($attempt = 0; $attempt < self::MAX_SLUG_RETRIES; $attempt++) {
            try {
                $currentSlug = $attempt === 0 ? $slug : $slug.'-'.$attempt;
                $currentSlugAr = $attempt === 0 ? $slugAr : $slugAr.'-'.$attempt;
                $currentSlugEn = $attempt === 0 ? $slugEn : $slugEn.'-'.$attempt;

                return Article::create([
                    'category_id' => $raw['category_id'] ?? null,
                    'title' => $title,
                    'title_en' => $title_en,
                    'title_ar' => $title_ar,
                    'slug' => $currentSlug,
                    'slug_ar' => $currentSlugAr,
                    'slug_en' => $currentSlugEn,
                    'content' => $content,
                    'content_en' => $content_en,
                    'content_ar' => $content_ar,
                    'excerpt' => $excerpt,
                    'excerpt_en' => $excerpt_en,
                    'excerpt_ar' => $excerpt_ar,
                    'alt_text' => isset($raw['alt_text']) ? Sanitizer::text($raw['alt_text']) : null,
                    'alt_text_ar' => isset($raw['alt_text_ar']) ? Sanitizer::text($raw['alt_text_ar']) : (isset($raw['alt_text']) ? Sanitizer::text($raw['alt_text']) : null),
                    'alt_text_en' => isset($raw['alt_text_en']) ? Sanitizer::text($raw['alt_text_en']) : null,
                    'keywords' => $raw['keywords_ar'] ?? $raw['keywords'] ?? $raw['keywords_en'] ?? null,
                    'keywords_ar' => $raw['keywords_ar'] ?? $raw['keywords'] ?? null,
                    'keywords_en' => $raw['keywords_en'] ?? null,
                    'meta_description' => isset($raw['meta_description_ar']) ? Sanitizer::text($raw['meta_description_ar']) : (isset($raw['meta_description']) ? Sanitizer::text($raw['meta_description']) : (isset($raw['meta_description_en']) ? Sanitizer::text($raw['meta_description_en']) : null)),
                    'meta_description_ar' => isset($raw['meta_description_ar']) ? Sanitizer::text($raw['meta_description_ar']) : (isset($raw['meta_description']) ? Sanitizer::text($raw['meta_description']) : null),
                    'meta_description_en' => isset($raw['meta_description_en']) ? Sanitizer::text($raw['meta_description_en']) : null,
                    'is_published' => $raw['is_published'] ?? false,
                    'published_at' => ($raw['is_published'] ?? false) ? now() : null,
                ]);
            } catch (QueryException $e) {
                // MySQL error 1062 = Duplicate entry (UNIQUE constraint violation)
                // SQLite error 19 / SQLSTATE 23000
                $errorCode = (int) ($e->errorInfo[1] ?? 0);
                $sqlState = (string) ($e->errorInfo[0] ?? '');

                if ($errorCode === 1062 || $errorCode === 19 || $sqlState === '23000') {
                    $lastException = $e;

                    continue;
                }
                throw $e;
            }
        }

        // All retries exhausted — re-throw the last collision exception
        throw $lastException;
    }
}
