<?php

namespace App\Domain\Users\Notifications;

use App\Domain\Users\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewMessageNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Message $message,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $unitName = $this->message->unit?->name;

        return [
            'type' => 'new_message',
            'title' => 'رسالة جديدة من عميل',
            'title_en' => 'New Message from Client',
            'message_id' => $this->message->id,
            'unit_id' => $this->message->unit_id,
            'unit_name' => $unitName,
            'client_name' => $this->message->client_name,
            'client_phone' => $this->message->client_phone,
            'content' => $this->message->content,
            'message' => $unitName
                ? "رسالة جديدة من {$this->message->client_name} بخصوص: {$unitName}"
                : "رسالة جديدة من {$this->message->client_name}",
        ];
    }
}
