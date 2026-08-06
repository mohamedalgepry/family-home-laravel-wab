<?php

use App\Domain\Users\Notifications\SendEmailChangeOtpNotification;
use App\Domain\Users\Services\ProfileService;
use Illuminate\Support\Facades\Notification;

test('admin can request OTP to change profile email to a new address', function () {
    Notification::fake();

    $admin = createUser('Admin OTP User', 'admin', null);

    $response = $this->actingAs($admin)
        ->post('/admin/profile/send-email-otp', [
            'new_email' => 'newadminemail@example.com',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    Notification::assertSentTo($admin, SendEmailChangeOtpNotification::class, function ($notification) {
        $this->assertMatchesRegularExpression('/^\d{6}$/', $notification->otpCode);

        return true;
    });
});

test('admin cannot request OTP for an email address already registered by another user', function () {
    Notification::fake();

    $otherUser = createUser('Other Existing User', 'manager', null);
    $admin = createUser('Admin User Duplicate', 'admin', null);

    $response = $this->actingAs($admin)
        ->post('/admin/profile/send-email-otp', [
            'new_email' => $otherUser->email,
        ]);

    $response->assertSessionHasErrors(['new_email']);
});

test('admin can verify valid OTP code and update email address', function () {
    Notification::fake();

    $admin = createUser('Admin Verification Success', 'admin', null);
    $profileService = app(ProfileService::class);
    $otpCode = $profileService->sendEmailChangeOtp($admin, 'updatedemail@example.com');

    $response = $this->actingAs($admin)
        ->post('/admin/profile/verify-email-otp', [
            'new_email' => 'updatedemail@example.com',
            'code' => $otpCode,
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    $this->assertEquals('updatedemail@example.com', $admin->fresh()->email);
});

test('admin cannot verify invalid OTP code for email change', function () {
    Notification::fake();

    $admin = createUser('Admin Verification Failure', 'admin', null);
    $profileService = app(ProfileService::class);
    $profileService->sendEmailChangeOtp($admin, 'updatedemail@example.com');

    $response = $this->actingAs($admin)
        ->post('/admin/profile/verify-email-otp', [
            'new_email' => 'updatedemail@example.com',
            'code' => '999999',
        ]);

    $response->assertSessionHasErrors(['code']);
    $this->assertNotEquals('updatedemail@example.com', $admin->fresh()->email);
});
