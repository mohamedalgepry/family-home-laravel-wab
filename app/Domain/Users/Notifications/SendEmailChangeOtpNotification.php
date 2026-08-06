<?php

namespace App\Domain\Users\Notifications;

use App\Domain\Listings\Services\SettingsService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendEmailChangeOtpNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly string $otpCode,
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
            ? 'Email Address Verification Code - Family Home'
            : 'رمز تأكيد تغيير البريد الإلكتروني - Family Home';

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.email_change_otp', [
                'otpCode' => $this->otpCode,
                'locale' => $this->locale,
                'isEnglish' => $isEnglish,
                'userName' => $userName,
                'logoUrl' => $logoUrl,
            ]);
    }
}
