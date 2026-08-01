<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Article;
use Illuminate\Support\Str;

class CreateArticleAction
{
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

        $slugBase = $title_en ?: ($title_ar ?: 'article');
        $slug = Str::slug($slugBase);
        if (! $slug) {
            $slug = 'article-'.Str::random(6);
        }
        $base = $slug;
        $suffix = 1;

        while (Article::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return Article::create([
            'category_id' => $raw['category_id'] ?? null,
            'title' => $title,
            'title_en' => $title_en,
            'title_ar' => $title_ar,
            'slug' => $slug,
            'slug_ar' => Str::slug($title_ar) ?: $slug.'-ar',
            'slug_en' => Str::slug($title_en) ?: $slug,
            'content' => $content,
            'content_en' => $content_en,
            'content_ar' => $content_ar,
            'excerpt' => $excerpt,
            'excerpt_en' => $excerpt_en,
            'excerpt_ar' => $excerpt_ar,
            'alt_text' => isset($raw['alt_text']) ? Sanitizer::text($raw['alt_text']) : null,
            'keywords' => $raw['keywords'] ?? null,
            'meta_description' => isset($raw['meta_description']) ? Sanitizer::text($raw['meta_description']) : null,
            'is_published' => $raw['is_published'] ?? false,
            'published_at' => ($raw['is_published'] ?? false) ? now() : null,
        ]);
    }
}
