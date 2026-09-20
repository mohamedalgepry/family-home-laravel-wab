<?php

use App\Domain\Users\Models\User;

/*
 * Authorization coverage for the most sensitive admin endpoints that had
 * no direct tests: financial resets, settings and user management.
 * These routes rely purely on route middleware, so a middleware
 * misconfiguration would silently expose them — these tests lock that down.
 */

beforeEach(function () {
    $this->admin = createUser('Authz Admin', 'admin');
    $this->manager = createUser('Authz Manager', 'manager');
    $this->agent = createUser('Authz Agent', 'agent', $this->manager->id);
});

test('only admin can trigger the monthly points reset', function () {
    $this->actingAs($this->manager)
        ->post(route('admin.points.monthly-reset'))
        ->assertStatus(403);

    $this->actingAs($this->agent)
        ->post(route('admin.points.monthly-reset'))
        ->assertStatus(403);

    $this->actingAs($this->admin)
        ->post(route('admin.points.monthly-reset'))
        ->assertStatus(302)
        ->assertSessionHasNoErrors();
});

test('only admin can trigger the manual daily deduction', function () {
    $this->actingAs($this->manager)
        ->post(route('admin.points.daily-deduct'))
        ->assertStatus(403);

    $this->actingAs($this->agent)
        ->post(route('admin.points.daily-deduct'))
        ->assertStatus(403);

    $this->actingAs($this->admin)
        ->post(route('admin.points.daily-deduct'))
        ->assertStatus(302)
        ->assertSessionHasNoErrors();
});

test('agents cannot reach the points allocation page or endpoint', function () {
    $this->actingAs($this->agent)
        ->get(route('admin.points.index'))
        ->assertStatus(403);

    $this->actingAs($this->agent)
        ->post(route('admin.points.allocate'), [
            'manager_id' => $this->manager->id,
            'points' => 100,
        ])
        ->assertStatus(403);
});

test('only admin can access the settings page and update settings', function () {
    $this->actingAs($this->manager)
        ->get(route('admin.settings.index'))
        ->assertStatus(403);

    $this->actingAs($this->manager)
        ->post(route('admin.settings.update'), ['company_phone' => '0100000000'])
        ->assertStatus(403);

    $this->actingAs($this->agent)
        ->post(route('admin.settings.update'), ['company_phone' => '0100000000'])
        ->assertStatus(403);

    $this->actingAs($this->admin)
        ->get(route('admin.settings.index'))
        ->assertOk();
});

test('non-admins cannot manage users', function () {
    foreach ([$this->manager, $this->agent] as $user) {
        $this->actingAs($user)->get(route('admin.users.index'))->assertStatus(403);

        $this->actingAs($user)->post(route('admin.users.store'), [
            'name' => 'Hacked User',
            'email' => 'hacked@test.com',
            'password' => 'password123',
            'role' => 'admin',
        ])->assertStatus(403);

        $this->actingAs($user)
            ->post(route('admin.users.change-password', $this->admin), [
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ])
            ->assertStatus(403);

        $this->actingAs($user)
            ->delete(route('admin.users.destroy', $this->admin))
            ->assertStatus(403);
    }

    // The admin account is untouched
    $this->assertTrue(User::where('id', $this->admin->id)->exists());
    $this->assertNull(User::where('email', 'hacked@test.com')->first());
});

test('managers cannot toggle another users active flag', function () {
    $this->actingAs($this->manager)
        ->post(route('admin.users.toggle-active', $this->admin))
        ->assertStatus(403);

    $this->assertTrue($this->admin->fresh()->is_active);
});

test('guests are redirected to login from all admin endpoints', function () {
    $this->get(route('admin.points.index'))->assertRedirect(route('login'));
    $this->post(route('admin.points.monthly-reset'))->assertRedirect(route('login'));
    $this->get(route('admin.settings.index'))->assertRedirect(route('login'));
    $this->get(route('admin.users.index'))->assertRedirect(route('login'));
});
