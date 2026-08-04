<?php

use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class)->in('Feature');

uses()->in('Unit');

function createUser(string $name, string $role, ?int $managerId): User
{
    $user = new User(['name' => $name, 'email' => strtolower(str_replace(' ', '-', $name)).'@test.com', 'password' => 'x']);
    $user->role = $role;
    $user->manager_id = $managerId;
    $user->save();

    return $user;
}
