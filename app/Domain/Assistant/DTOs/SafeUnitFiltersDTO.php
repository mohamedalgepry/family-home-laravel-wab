<?php

namespace App\Domain\Assistant\DTOs;

class SafeUnitFiltersDTO
{
    public function __construct(
        public readonly ?string $transaction = null,
        public readonly ?int $minPrice = null,
        public readonly ?int $maxPrice = null,
        public readonly ?int $rooms = null,
        public readonly ?int $bathrooms = null,
        public readonly ?int $minAreaSqm = null,
        public readonly ?int $maxAreaSqm = null,
        public readonly ?string $paymentMethod = null,
        public readonly ?string $sort = null,
    ) {}

    /**
     * Build from array with strict sanitization and allowlists.
     * Prevents any raw SQL, injection or unexpected fields.
     */
    public static function fromArray(array $data): self
    {
        // 1. Transaction allowlist
        $transaction = isset($data['transaction']) && is_string($data['transaction'])
            ? strtolower(trim($data['transaction']))
            : null;
        if (!in_array($transaction, ['sale', 'rent'], true)) {
            $transaction = null;
        }

        // 2. Numeric bounds
        $minPrice = isset($data['min_price']) && is_numeric($data['min_price'])
            ? max(0, min(1000000000, (int) $data['min_price']))
            : null;

        $maxPrice = isset($data['max_price']) && is_numeric($data['max_price'])
            ? max(0, min(1000000000, (int) $data['max_price']))
            : null;

        $rooms = isset($data['rooms']) && is_numeric($data['rooms'])
            ? max(1, min(20, (int) $data['rooms']))
            : null;

        $bathrooms = isset($data['bathrooms']) && is_numeric($data['bathrooms'])
            ? max(1, min(10, (int) $data['bathrooms']))
            : null;

        $minAreaSqm = isset($data['min_area_sqm']) && is_numeric($data['min_area_sqm'])
            ? max(10, min(10000, (int) $data['min_area_sqm']))
            : null;

        $maxAreaSqm = isset($data['max_area_sqm']) && is_numeric($data['max_area_sqm'])
            ? max(10, min(10000, (int) $data['max_area_sqm']))
            : null;

        // 3. Payment method allowlist
        $paymentMethod = isset($data['payment_method']) && is_string($data['payment_method'])
            ? strtolower(trim($data['payment_method']))
            : null;
        if (!in_array($paymentMethod, ['cash', 'installment'], true)) {
            $paymentMethod = null;
        }

        // 4. Sort order allowlist
        $sort = isset($data['sort']) && is_string($data['sort'])
            ? strtolower(trim($data['sort']))
            : null;
        if (!in_array($sort, ['price_asc', 'price_desc', 'newest'], true)) {
            $sort = 'newest';
        }

        return new self(
            transaction: $transaction,
            minPrice: $minPrice,
            maxPrice: $maxPrice,
            rooms: $rooms,
            bathrooms: $bathrooms,
            minAreaSqm: $minAreaSqm,
            maxAreaSqm: $maxAreaSqm,
            paymentMethod: $paymentMethod,
            sort: $sort,
        );
    }
}
