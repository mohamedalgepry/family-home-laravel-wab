<?php

use App\Domain\Users\Notifications\SendOtpResetNotification;
use App\Domain\Users\Services\AuthService;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

test('forgot password page renders successfully', function () {
    $response = $this->get('/forgot-password');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('Shared/ForgotPassword'));
});

test('forgot password request generates 6 digit random OTP and sends notification in current locale', function () {
    Notification::fake();
    app()->setLocale('ar');

    $user = createUser('Reset OTP User', 'agent', null);

    $response = $this->post('/forgot-password', [
        'email' => $user->email,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('password.otp'));
    $response->assertSessionHas('password_reset_email', $user->email);

    $record = DB::table('password_otps')->where('email', $user->email)->first();
    $this->assertNotNull($record);
    $this->assertNotNull($record->code_hash);

    Notification::assertSentTo($user, SendOtpResetNotification::class, function ($notification) {
        $this->assertMatchesRegularExpression('/^\d{6}$/', $notification->otpCode);
        $this->assertEquals('ar', $notification->locale);
        $mail = $notification->toMail(new stdClass);
        $this->assertStringContainsString('رمز إعادة ضبط كلمة السر', $mail->subject);
        $this->assertNotEmpty($mail->viewData['logoUrl']);

        return true;
    });
});

test('forgot password notification supports english locale when app locale is set to en', function () {
    Notification::fake();
    app()->setLocale('en');

    $user = createUser('English OTP User', 'agent', null);

    $authService = app(AuthService::class);
    $authService->sendOtp($user->email, 'en');

    Notification::assertSentTo($user, SendOtpResetNotification::class, function ($notification) {
        $this->assertEquals('en', $notification->locale);
        $mail = $notification->toMail((object) ['name' => 'John']);
        $this->assertStringContainsString('Password Reset Verification Code', $mail->subject);
        $this->assertEquals('John', $mail->viewData['userName']);
        $this->assertNotEmpty($mail->viewData['logoUrl']);

        return true;
    });

    app()->setLocale('ar');
});

test('forgot password fails validation when email is not registered', function () {
    Notification::fake();

    $response = $this->post('/forgot-password', [
        'email' => 'nonexistent@example.com',
    ]);

    $response->assertSessionHasErrors(['email']);
    $this->assertDatabaseMissing('password_otps', ['email' => 'nonexistent@example.com']);
});

test('verify otp page requires active reset session', function () {
    $response = $this->get('/verify-otp');

    $response->assertRedirect(route('password.request'));
});

test('verify otp page renders with session email', function () {
    $response = $this->withSession(['password_reset_email' => 'test@example.com'])
        ->get('/verify-otp');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Shared/VerifyOtp')
        ->where('email', 'test@example.com')
    );
});

test('user can verify valid 6 digit OTP and receives 5 minute reset token', function () {
    $user = createUser('User Verify OTP', 'agent', null);
    $authService = app(AuthService::class);
    $otpCode = $authService->sendOtp($user->email);

    $response = $this->withSession(['password_reset_email' => $user->email])
        ->post('/verify-otp', [
            'email' => $user->email,
            'code' => $otpCode,
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $record = DB::table('password_otps')->where('email', $user->email)->first();
    $this->assertNotNull($record->reset_token_hash);
    $this->assertNull($record->code_hash);
    $this->assertNotNull($record->reset_expires_at);
});

test('user cannot verify invalid 6 digit OTP code', function () {
    $user = createUser('User Invalid OTP', 'agent', null);
    $authService = app(AuthService::class);
    $authService->sendOtp($user->email);

    $response = $this->withSession(['password_reset_email' => $user->email])
        ->post('/verify-otp', [
            'email' => $user->email,
            'code' => '999999',
        ]);

    $response->assertSessionHasErrors(['code']);
});

test('user can reset password within 5 minute window', function () {
    $user = createUser('User Timed Reset Success', 'agent', null);
    $authService = app(AuthService::class);
    $otpCode = $authService->sendOtp($user->email);
    $resetToken = $authService->verifyOtp($user->email, $otpCode);

    $response = $this->withSession(['password_reset_email' => $user->email])
        ->post('/reset-password', [
            'token' => $resetToken,
            'email' => $user->email,
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('login'));

    $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
    $this->assertDatabaseMissing('password_otps', ['email' => $user->email]);
});

test('user cannot reset password after 5 minute window expires', function () {
    $user = createUser('User Timed Reset Expired', 'agent', null);
    $authService = app(AuthService::class);
    $otpCode = $authService->sendOtp($user->email);
    $resetToken = $authService->verifyOtp($user->email, $otpCode);

    Carbon::setTestNow(now()->addMinutes(6));

    $response = $this->withSession(['password_reset_email' => $user->email])
        ->post('/reset-password', [
            'token' => $resetToken,
            'email' => $user->email,
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

    $response->assertSessionHasErrors(['email']);

    Carbon::setTestNow();
});

test('otp generation produces random 6-digit codes and complete redirection flow works correctly', function () {
    Notification::fake();
    $user = createUser('Flow Redirect User', 'agent', null);

    $forgotResponse = $this->post('/forgot-password', [
        'email' => $user->email,
    ]);

    $forgotResponse->assertRedirect(route('password.otp'));
    $forgotResponse->assertSessionHas('password_reset_email', $user->email);

    $sentCode = null;
    Notification::assertSentTo($user, SendOtpResetNotification::class, function ($notification) use (&$sentCode) {
        $sentCode = $notification->otpCode;

        return true;
    });

    $this->assertMatchesRegularExpression('/^\d{6}$/', $sentCode);
    $this->assertGreaterThanOrEqual(100000, (int) $sentCode);
    $this->assertLessThanOrEqual(999999, (int) $sentCode);

    $verifyResponse = $this->post('/verify-otp', [
        'email' => $user->email,
        'code' => $sentCode,
    ]);

    $verifyResponse->assertRedirect();
    $targetUrl = $verifyResponse->headers->get('Location');
    $this->assertStringContainsString('/reset-password/', $targetUrl);
    $this->assertStringNotContainsString('email=', $targetUrl);

    $path = parse_url($targetUrl, PHP_URL_PATH);
    $token = basename($path);

    $resetPageResponse = $this->get('/reset-password/'.$token);
    $resetPageResponse->assertOk();

    $resetResponse = $this->post('/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-secure-pass-123',
        'password_confirmation' => 'new-secure-pass-123',
    ]);

    $resetResponse->assertRedirect('/login');
});
