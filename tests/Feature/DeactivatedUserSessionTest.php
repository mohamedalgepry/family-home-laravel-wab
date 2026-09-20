<?php

use Illuminate\Support\Facades\Auth;

test('a deactivated user with an active session is logged out on the next request', function () {
    $admin = createUser('Session Admin', 'admin');

    // Login works while the account is active
    $this->actingAs($admin)
        ->get('/admin')
        ->assertOk();

    // Admin deactivates the account while the session is still alive
    $admin->is_active = false;
    $admin->save();

    // The very next request must terminate the session and redirect to login
    $response = $this->get('/admin');

    $response->assertRedirect(route('login'));
    $this->assertGuest();
});

test('a deactivated user receives 403 json on ajax requests', function () {
    $manager = createUser('Session Manager', 'manager');

    $this->actingAs($manager);

    $manager->is_active = false;
    $manager->save();

    $this->getJson('/admin/notifications/unread-count')
        ->assertStatus(403);

    $this->assertGuest();
});

test('an active user session is not affected by the middleware', function () {
    $admin = createUser('Active Admin', 'admin');

    $this->actingAs($admin)
        ->get('/admin')
        ->assertOk();

    $this->assertTrue(Auth::check());
});
