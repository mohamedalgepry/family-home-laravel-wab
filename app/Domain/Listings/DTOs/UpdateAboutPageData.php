<?php

namespace App\Domain\Listings\DTOs;

use Spatie\LaravelData\Data;

class UpdateAboutPageData extends Data
{
    public function __construct(
        public readonly string $content_ar,
        public readonly string $content_en,
        public readonly ?array $images = null,
    ) {}
}
