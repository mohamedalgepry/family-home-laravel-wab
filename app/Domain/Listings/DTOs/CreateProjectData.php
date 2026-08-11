<?php

namespace App\Domain\Listings\DTOs;

use Spatie\LaravelData\Data;

class CreateProjectData extends Data
{
    public function __construct(
        public readonly string $name_en,
        public readonly ?int $area_id = null,
        public readonly ?string $name_ar = null,
        public readonly ?string $description_ar = null,
        public readonly ?string $description_en = null,
        public readonly ?string $alt_text = null,
        public readonly ?string $video_url = null,
        public readonly ?string $map_embed_url = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null,
        public readonly ?string $location_address_ar = null,
        public readonly ?string $location_address_en = null,
        public readonly ?array $keywords_ar = [],
        public readonly ?array $keywords_en = [],
        public readonly ?string $meta_description_ar = null,
        public readonly ?string $meta_description_en = null,
        public readonly bool $is_active = true,
        public readonly ?string $payment_method = null,
        public readonly ?string $down_payment = null,
        public readonly ?int $installment_years = null,
        public readonly ?int $finishing_type_id = null,
        public readonly ?array $features = [],
        public readonly ?int $user_id = null,
    ) {}
}
