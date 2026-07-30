<?php

namespace App\Domain\Points\DTOs;

use Spatie\LaravelData\Data;

class AllocatePointsData extends Data
{
    public function __construct(
        public readonly int $manager_id,
        public readonly int $points,
        public readonly ?int $unit_id = null,
        public readonly ?string $notes = null,
    ) {}
}
