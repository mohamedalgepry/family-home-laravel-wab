<?php

namespace App\Domain\Users\Notifications;

use App\Domain\Listings\Services\SettingsService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendWelcomeNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly string $plainPassword,
        string $locale = 'ar'
    ) {
        $this->locale = $locale;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $isEnglish = strtolower($this->locale) === 'en';
        $userName = $notifiable->name ?? ($isEnglish ? 'User' : 'عزيزنا المستخدم');

        $settingsService = app(SettingsService::class);
        $siteLogo = $settingsService->get('site_logo');
        $logoUrl = $siteLogo ? asset('storage/'.$siteLogo) : asset('icon.png');

        $subject = $isEnglish
            ? 'Welcome to Family Home - Your Account Details'
            : 'مرحباً بك في Family Home - بيانات حسابك';

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.welcome', [
                'plainPassword' => $this->plainPassword,
                'locale' => $this->locale,
                'isEnglish' => $isEnglish,
                'userName' => $userName,
                'userEmail' => $notifiable->email,
                'loginUrl' => url('/login'),
                'logoUrl' => $logoUrl,
            ]);
    }
}
