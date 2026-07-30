<?php

namespace App\Domain\Listings\DTOs;

use Spatie\LaravelData\Data;

class CreateArticleData extends Data
{
    public function __construct(
        public readonly int $category_id,
        public readonly string $title_en,
        public readonly string $content_en,
        public readonly ?string $title_ar = null,
        public readonly ?string $content_ar = null,
        public readonly ?string $excerpt_ar = null,
        public readonly ?string $excerpt_en = null,
        public readonly ?string $alt_text = null,
        public readonly ?array $keywords = null,
        public readonly ?string $meta_description = null,
        public readonly bool $is_published = false,
    ) {}
}
