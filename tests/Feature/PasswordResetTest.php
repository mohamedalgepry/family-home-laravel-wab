<?php

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

test('forgot password page renders successfully', function () {
    $response = $this->get('/forgot-password');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('Shared/ForgotPassword'));
});

test('forgot password request sends password reset link to valid user', function () {
    $user = createUser('Reset Test User', 'agent', null);

    $response = $this->post('/forgot-password', [
        'email' => $user->email,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
});

test('reset password page renders with token', function () {
    $response = $this->get('/reset-password/sample-token');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Shared/ResetPassword')
        ->where('token', 'sample-token')
    );
});

test('user can reset password with valid token', function () {
    $user = createUser('User Password Reset', 'agent', null);
    $token = Password::createToken($user);

    $response = $this->post('/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    $response->assertSessionHas('status');

    $this->assertTrue(Hash::check('new-password-123', $user->fresh()->password));
});
