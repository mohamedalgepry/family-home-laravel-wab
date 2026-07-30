<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateMessageData;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\NewMessageNotification;

class CreateMessageAction
{
    public function execute(CreateMessageData $data): Message
    {
        $unit = $data->unit_id ? Unit::find($data->unit_id) : null;
        $agentId = $unit ? $unit->user_id : User::where('role', 'admin')->first()?->id;

        $message = Message::create([
            'unit_id' => $unit?->id,
            'agent_id' => $agentId,
            'client_name' => Sanitizer::text($data->client_name),
            'client_phone' => $data->client_phone ? Sanitizer::text($data->client_phone) : null,
            'client_email' => $data->client_email ? Sanitizer::text($data->client_email) : null,
            'content' => Sanitizer::text($data->content),
            'status' => 'pending',
        ]);

        if ($agentId) {
            $agent = User::find($agentId);
            if ($agent) {
                $agent->notify(new NewMessageNotification($message));
            }
        }

        return $message;
    }
}
