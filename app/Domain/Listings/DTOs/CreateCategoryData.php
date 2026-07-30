<?php

namespace App\Domain\Listings\DTOs;

use Spatie\LaravelData\Data;

class CreateCategoryData extends Data
{
    public function __construct(
        public readonly string $name_ar,
        public readonly string $name_en,
    ) {}
}
