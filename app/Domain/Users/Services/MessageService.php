<?php

namespace App\Domain\Users\Services;

use App\Domain\Listings\Actions\CreateMessageAction;
use App\Domain\Listings\DTOs\CreateMessageData;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\Message;

class MessageService
{
    public function __construct(
        private readonly CreateMessageAction $createMessageAction,
    ) {}

    public function createMessage(int $unitId, string $clientName, string $content, ?string $clientPhone = null, ?string $clientEmail = null): Message
    {
        $unit = Unit::findOrFail($unitId);

        $data = new CreateMessageData(
            unit_id: $unit->id,
            client_name: $clientName,
            content: $content,
            client_phone: $clientPhone,
            client_email: $clientEmail,
        );

        return $this->createMessageAction->execute($data);
    }
}
