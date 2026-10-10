<?php

use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows an admin to change a user role and assigns a manager to agents', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'is_active' => true,
    ]);
    $manager = User::factory()->create([
        'role' => 'manager',
        'is_active' => true,
    ]);
    $user = User::factory()->create([
        'role' => 'agent',
        'manager_id' => $manager->id,
        'is_active' => true,
    ]);

    $this->actingAs($admin)
        ->post(route('admin.users.change-role', $user), [
            'role' => 'admin',
        ])
        ->assertRedirect(route('admin.users.index'));

    $user->refresh();
    expect($user->role)->toBe('admin')
        ->and($user->manager_id)->toBeNull();

    $this->actingAs($admin)
        ->post(route('admin.users.change-role', $user), [
            'role' => 'agent',
            'manager_id' => $manager->id,
        ])
        ->assertRedirect(route('admin.users.index'));

    $user->refresh();
    expect($user->role)->toBe('agent')
        ->and($user->manager_id)->toBe($manager->id);
});

it('does not allow an admin to change their own role', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'is_active' => true,
    ]);

    $this->actingAs($admin)
        ->post(route('admin.users.change-role', $admin), [
            'role' => 'manager',
        ])
        ->assertRedirect(route('admin.users.index'));

    expect($admin->refresh()->role)->toBe('admin');
});

it('requires a manager when changing a user to agent', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'is_active' => true,
    ]);
    $user = User::factory()->create([
        'role' => 'manager',
        'is_active' => true,
    ]);

    $this->actingAs($admin)
        ->post(route('admin.users.change-role', $user), [
            'role' => 'agent',
        ])
        ->assertSessionHasErrors('manager_id');

    expect($user->refresh()->role)->toBe('manager');
});
