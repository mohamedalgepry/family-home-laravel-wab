<?php

namespace App\Domain\Users\Notifications;

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
        $url = $this->buildMailUrl($notifiable);

        return (new MailMessage)
            ->subject('إعادة ضبط كلمة السر - Family Home')
            ->greeting('مرحباً '.$notifiable->name)
            ->line('لقد تلقينا طلباً لإعادة ضبط كلمة السر الخاصة بحسابك في منصة Family Home.')
            ->action('إعادة ضبط كلمة السر الآن', $url)
            ->line('ملاحظة: هذا الرابط صالـح لمدة '.config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60).' دقيقة فقط.')
            ->line('إذا لم تقم بطلب إعادة ضبط كلمة السر بنفسك، فيمكنك تجاهل هذه الرسالة بأمان.');
    }
}
