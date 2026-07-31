<?php

namespace App\Domain\Users\Notifications;

use App\Domain\Users\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewMessageNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly Message $message,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $unitName = $this->message->unit?->name;
        $subject = $unitName
            ? "استفسار جديد عن عقار: {$unitName}"
            : "استفسار جديد من عميل عبر فاميلي هوم";

        return (new MailMessage)
            ->subject($subject)
            ->greeting("مرحباً {$notifiable->name}،")
            ->line("لقد استلمت رسالة جديدة من العميل: {$this->message->client_name}")
            ->line("رقم الهاتف: {$this->message->client_phone}")
            ->line($unitName ? "العقار المستهدف: {$unitName}" : "")
            ->line("نص الرسالة: {$this->message->content}")
            ->action('عرض الرسائل في لوحة التحكم', url('/admin/messages'));
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
