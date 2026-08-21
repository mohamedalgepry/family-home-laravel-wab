<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Article;

class UpdateArticleAction
{
    public function execute(int $articleId, CreateArticleData $data): Article
    {
        $article = Article::findOrFail($articleId);

        $raw = $data->toArray();

        $title_ar = isset($raw['title_ar']) ? Sanitizer::text($raw['title_ar']) : null;
        $title_en = isset($raw['title_en']) ? Sanitizer::text($raw['title_en']) : null;
        $title = $title_ar ?: ($title_en ?: $article->title);

        $content_ar = isset($raw['content_ar']) ? Sanitizer::rich($raw['content_ar']) : null;
        $content_en = isset($raw['content_en']) ? Sanitizer::rich($raw['content_en']) : null;
        $content = $content_ar ?: ($content_en ?: $article->content);

        $excerpt_ar = isset($raw['excerpt_ar']) ? Sanitizer::text($raw['excerpt_ar']) : null;
        $excerpt_en = isset($raw['excerpt_en']) ? Sanitizer::text($raw['excerpt_en']) : null;
        $excerpt = $excerpt_ar ?: ($excerpt_en ?: $article->excerpt);

        $article->update([
            'category_id' => $raw['category_id'] ?? null,
            'title' => $title,
            'title_en' => $title_en,
            'title_ar' => $title_ar,
            'content' => $content,
            'content_en' => $content_en,
            'content_ar' => $content_ar,
            'excerpt' => $excerpt,
            'excerpt_en' => $excerpt_en,
            'excerpt_ar' => $excerpt_ar,
            'alt_text' => isset($raw['alt_text']) ? Sanitizer::text($raw['alt_text']) : $article->alt_text,
            'alt_text_ar' => isset($raw['alt_text_ar']) ? Sanitizer::text($raw['alt_text_ar']) : (isset($raw['alt_text']) ? Sanitizer::text($raw['alt_text']) : $article->alt_text_ar),
            'alt_text_en' => isset($raw['alt_text_en']) ? Sanitizer::text($raw['alt_text_en']) : $article->alt_text_en,
            'keywords' => $raw['keywords_ar'] ?? $raw['keywords'] ?? $article->keywords,
            'keywords_ar' => $raw['keywords_ar'] ?? $raw['keywords'] ?? $article->keywords_ar,
            'keywords_en' => $raw['keywords_en'] ?? $article->keywords_en,
            'meta_description' => isset($raw['meta_description_ar']) ? Sanitizer::text($raw['meta_description_ar']) : (isset($raw['meta_description']) ? Sanitizer::text($raw['meta_description']) : $article->meta_description),
            'meta_description_ar' => isset($raw['meta_description_ar']) ? Sanitizer::text($raw['meta_description_ar']) : (isset($raw['meta_description']) ? Sanitizer::text($raw['meta_description']) : $article->meta_description_ar),
            'meta_description_en' => isset($raw['meta_description_en']) ? Sanitizer::text($raw['meta_description_en']) : $article->meta_description_en,
            'is_published' => $raw['is_published'] ?? false,
            'published_at' => ($raw['is_published'] ?? false) ? ($article->published_at ?? now()) : null,
        ]);

        return $article->fresh();
    }
}
