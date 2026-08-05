<?php

use App\Domain\Users\Notifications\SendWelcomeNotification;
use Illuminate\Support\Facades\Notification;

test('admin creating a user sends welcome email with credentials', function () {
    Notification::fake();

    $admin = createUser('Admin Creator', 'admin', null);

    $response = $this->actingAs($admin)->post('/admin/users', [
        'name' => 'New Agent',
        'email' => 'newagent@example.com',
        'password' => 'secure-pass-123',
        'password_confirmation' => 'secure-pass-123',
        'role' => 'agent',
    ]);

    $response->assertRedirect(route('admin.users.index'));

    $user = \App\Domain\Users\Models\User::where('email', 'newagent@example.com')->first();
    $this->assertNotNull($user);

    Notification::assertSentTo($user, SendWelcomeNotification::class, function ($notification) {
        $this->assertEquals('secure-pass-123', $notification->plainPassword);
        $mail = $notification->toMail((object) ['name' => 'New Agent', 'email' => 'newagent@example.com']);
        $this->assertStringContainsString('secure-pass-123', $mail->render());

        return true;
    });
});
