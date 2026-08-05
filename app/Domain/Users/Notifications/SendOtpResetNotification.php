<?php

namespace App\Domain\Users\Notifications;

use App\Domain\Listings\Services\SettingsService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendOtpResetNotification extends Notification
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
            ? 'Password Reset Verification Code - Family Home'
            : 'رمز إعادة ضبط كلمة السر - Family Home';

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.otp_reset', [
                'otpCode' => $this->otpCode,
                'locale' => $this->locale,
                'isEnglish' => $isEnglish,
                'userName' => $userName,
                'logoUrl' => $logoUrl,
            ]);
    }
}
