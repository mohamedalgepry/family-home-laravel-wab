<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

uses(TestCase::class, DatabaseTransactions::class)->in('Feature');

uses()->in('Unit');

function createUser(string $name, string $role, ?int $managerId = null): User
{
    $user = new User(['name' => $name, 'email' => strtolower(str_replace(' ', '-', $name)).'@test.com', 'password' => 'x']);
    $user->role = $role;
    $user->manager_id = $managerId;
    $user->save();

    return $user;
}

function createTestUnit(array $attributes = []): Unit
{
    $defaults = [
        'name' => 'Default Unit Name',
        'name_ar' => 'اسم الوحدة',
        'name_en' => 'Default Unit Name',
        'slug' => 'default-unit-'.uniqid(),
        'slug_ar' => 'default-unit-ar-'.uniqid(),
        'slug_en' => 'default-unit-en-'.uniqid(),
        'price' => 1000,
        'transaction' => 'sale',
    ];

    if (! isset($attributes['type_id'])) {
        $defaults['type_id'] = UnitType::firstOrCreate(['slug' => 'default-test-type'], ['name_en' => 'Test Type', 'name_ar' => 'نوع اختياري'])->id;
    }
    if (! isset($attributes['area_id'])) {
        $defaults['area_id'] = Area::firstOrCreate(['slug' => 'default-test-area'], ['name_en' => 'Test Area', 'name_ar' => 'منطقة اختيارية'])->id;
    }
    if (! isset($attributes['user_id'])) {
        $defaults['user_id'] = User::firstOrCreate(['email' => 'test_user_id@test.com'], ['name' => 'Test User', 'password' => 'x', 'role' => 'admin'])->id;
    }

    $unit = new Unit;
    $unit->forceFill(array_merge($defaults, $attributes));
    $unit->save();

    return $unit;
}

function createFakeImage(string $name = 'photo.jpg'): \Illuminate\Http\UploadedFile
{
    $jpegContent = base64_decode('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=');
    return \Illuminate\Http\UploadedFile::fake()->createWithContent($name, $jpegContent);
}
