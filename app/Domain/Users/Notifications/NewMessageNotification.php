<?php

namespace App\Domain\Users\Notifications;

use App\Domain\Listings\Services\SettingsService;
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
        $locale = app()->getLocale();
        $isEnglish = strtolower($locale) === 'en';
        $unitName = $this->message->unit?->name;
        $recipientName = $notifiable->name ?? ($isEnglish ? 'Team member' : 'زميلنا العزيز');

        // سطر التوجيه: لماذا وصل هذا الاستفسار لهذا المستلم تحديداً
        if ($unitName) {
            $routingReason = $isEnglish
                ? 'This inquiry reached you because you are the owner of this property.'
                : 'وصل إليك هذا الاستفسار لأنك مالك هذه الوحدة على المنصة.';
        } else {
            $routingReason = $isEnglish
                ? 'This general inquiry reached you as part of the platform administration.'
                : 'وصل إليك هذا الاستفسار العام بصفتك من إدارة المنصة.';
        }

        $settingsService = app(SettingsService::class);
        $siteLogo = $settingsService->get('site_logo');
        $logoUrl = $siteLogo ? asset('storage/'.$siteLogo) : asset('icon.png');

        $subject = $unitName
            ? ($isEnglish ? "New inquiry about: {$unitName}" : "استفسار جديد عن عقار: {$unitName}")
            : ($isEnglish ? 'New client inquiry - Family Home' : 'استفسار جديد من عميل عبر فاميلي هوم');

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.new_message', [
                'subject' => $subject,
                'locale' => $locale,
                'isEnglish' => $isEnglish,
                'logoUrl' => $logoUrl,
                'recipientName' => $recipientName,
                'routingReason' => $routingReason,
                'clientName' => $this->message->client_name,
                'clientPhone' => $this->message->client_phone ?? '',
                'clientEmail' => $this->message->client_email ?? '',
                'unitName' => $unitName ?? '',
                'messageContent' => $this->message->content,
                'messagesUrl' => url('/admin/messages'),
            ]);
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
