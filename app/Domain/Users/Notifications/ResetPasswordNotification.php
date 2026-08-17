<?php

namespace App\Domain\Users\Notifications;

use App\Domain\Listings\Services\SettingsService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    protected function buildMailUrl($notifiable): string
    {
        return url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));
    }

    public function toMail($notifiable): MailMessage
    {
        $isEnglish = strtolower(app()->getLocale()) === 'en';
        $userName = $notifiable->name ?? ($isEnglish ? 'User' : 'عزيزنا المستخدم');

        $settingsService = app(SettingsService::class);
        $siteLogo = $settingsService->get('site_logo');
        $logoUrl = $siteLogo ? asset('storage/'.$siteLogo) : asset('icon.png');

        $expireMinutes = config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60);

        return (new MailMessage)
            ->subject($isEnglish
                ? 'Reset Your Password - Family Home'
                : 'إعادة ضبط كلمة السر - Family Home')
            ->view('emails.reset-password', [
                'locale' => app()->getLocale(),
                'isEnglish' => $isEnglish,
                'userName' => $userName,
                'resetUrl' => $this->buildMailUrl($notifiable),
                'expireMinutes' => $expireMinutes,
                'logoUrl' => $logoUrl,
            ]);
    }
}
