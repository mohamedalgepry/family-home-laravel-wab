<?php

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Hash;

it('denies access to non-admin users', function () {
    $manager = createUser('Manager User', 'manager', null);
    $agent = createUser('Agent User', 'agent', $manager->id);

    // Guest redirected to login
    $this->get(route('admin.users.index'))
        ->assertRedirect(route('login'));

    // Manager blocked
    $this->actingAs($manager)
        ->get(route('admin.users.index'))
        ->assertForbidden();

    // Agent blocked
    $this->actingAs($agent)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

it('allows an admin to view the users index page', function () {
    $admin = createUser('Super Admin', 'admin', null);
    $manager = createUser('Team Manager', 'manager', null);
    $agent = createUser('Sales Rep', 'agent', $manager->id);

    $response = $this->actingAs($admin)
        ->get(route('admin.users.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Index')
            ->has('users')
            ->has('managers')
            ->has('filters')
        );
});

it('allows an admin to toggle user active status', function () {
    $admin = createUser('Super Admin', 'admin', null);
    $user = createUser('Target Agent', 'agent', null);
    $user->is_active = true;
    $user->save();

    expect($user->is_active)->toBeTrue();

    // Deactivate
    $this->actingAs($admin)
        ->post(route('admin.users.toggle-active', $user))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    expect($user->refresh()->is_active)->toBeFalse();

    // Re-activate
    $this->actingAs($admin)
        ->post(route('admin.users.toggle-active', $user))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    expect($user->refresh()->is_active)->toBeTrue();
});

it('prevents an admin from deactivating their own account', function () {
    $admin = createUser('Protected Admin', 'admin', null);
    $admin->is_active = true;
    $admin->save();

    $this->actingAs($admin)
        ->post(route('admin.users.toggle-active', $admin))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('error');

    expect($admin->refresh()->is_active)->toBeTrue();
});

it('allows an admin to change a user password', function () {
    $admin = createUser('Super Admin', 'admin', null);
    $user = createUser('Password Change User', 'agent', null);

    $newPassword = 'NewSecretPassword2026';

    $this->actingAs($admin)
        ->post(route('admin.users.change-password', $user), [
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
        ])
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    $user->refresh();
    expect(Hash::check($newPassword, $user->password))->toBeTrue();
});

it('prevents an admin from deleting their own account', function () {
    $admin = createUser('Immortal Admin', 'admin', null);

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertForbidden();

    expect(User::find($admin->id))->not->toBeNull();
});

it('allows an admin to delete another user', function () {
    $admin = createUser('Super Admin', 'admin', null);
    $user = createUser('Delete Me', 'agent', null);

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    expect(User::find($user->id))->toBeNull();
});
