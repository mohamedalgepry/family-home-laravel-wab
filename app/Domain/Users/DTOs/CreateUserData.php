<?php

namespace App\Domain\Users\DTOs;

use Spatie\LaravelData\Data;

class CreateUserData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly string $role = 'agent',
        public readonly ?string $phone = null,
        public readonly ?string $whatsapp = null,
        public readonly ?string $facebook = null,
        public readonly ?int $initial_monthly_balance = null,
    ) {}
}
