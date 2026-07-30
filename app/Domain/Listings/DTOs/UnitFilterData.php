<?php

namespace App\Domain\Listings\DTOs;

use Spatie\LaravelData\Data;

class UnitFilterData extends Data
{
    public function __construct(
        public readonly ?string $q = null,
        public readonly ?int $area_id = null,
        public readonly ?int $type_id = null,
        public readonly ?string $transaction = null,
        public readonly ?float $price_from = null,
        public readonly ?float $price_to = null,
        public readonly ?float $area_sqm_from = null,
        public readonly ?float $area_sqm_to = null,
        public readonly ?int $rooms = null,
        public readonly ?bool $is_deal = null,
        public readonly ?string $sort = null,
    ) {}
}
