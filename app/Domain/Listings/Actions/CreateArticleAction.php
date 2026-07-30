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

        $slug = Str::slug($data->title_en);
        $base = $slug;
        $suffix = 1;

        while (Article::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return Article::create([
            'category_id' => $raw['category_id'] ?? null,
            'title' => Sanitizer::text($raw['title_en'] ?? ''),
            'title_en' => Sanitizer::text($raw['title_en'] ?? ''),
            'title_ar' => isset($raw['title_ar']) ? Sanitizer::text($raw['title_ar']) : null,
            'slug' => $slug,
            'content' => Sanitizer::rich($raw['content_en'] ?? ''),
            'content_en' => Sanitizer::rich($raw['content_en'] ?? ''),
            'content_ar' => isset($raw['content_ar']) ? Sanitizer::rich($raw['content_ar']) : null,
            'excerpt_en' => isset($raw['excerpt_en']) ? Sanitizer::text($raw['excerpt_en']) : null,
            'excerpt_ar' => isset($raw['excerpt_ar']) ? Sanitizer::text($raw['excerpt_ar']) : null,
            'excerpt' => isset($raw['excerpt_en']) ? Sanitizer::text($raw['excerpt_en']) : null,
            'alt_text' => isset($raw['alt_text']) ? Sanitizer::text($raw['alt_text']) : null,
            'keywords' => $raw['keywords'] ?? null,
            'meta_description' => isset($raw['meta_description']) ? Sanitizer::text($raw['meta_description']) : null,
            'is_published' => $raw['is_published'] ?? false,
            'published_at' => $raw['published_at'] ?? null,
        ]);
    }
}
