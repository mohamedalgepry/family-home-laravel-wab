<?php

namespace App\Domain\Listings\DTOs;

use Spatie\LaravelData\Data;

class CreateMessageData extends Data
{
    public function __construct(
        public readonly string $client_name,
        public readonly string $content,
        public readonly ?int $unit_id = null,
        public readonly ?string $client_phone = null,
        public readonly ?string $client_email = null,
    ) {}
}
