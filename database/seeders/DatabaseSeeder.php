<?php

namespace Database\Seeders;

use App\Domain\Users\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AreaSeeder::class,
            UnitTypeSeeder::class,
        ]);

        $adminPassword = env('ADMIN_SEED_PASSWORD', str()->random(16));

        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'مدير النظام (Admin)',
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'is_active' => true,
                'points_balance' => 0,
                'initial_monthly_balance' => 0,
            ]
        );

        if (empty(env('ADMIN_SEED_PASSWORD'))) {
            $this->command?->warn("⚠️  ADMIN_SEED_PASSWORD غير معرف في .env — تم إنشاء باسورد عشوائي: {$adminPassword}");
            $this->command?->warn('⚠️  سجّل الدخول فوراً وغيّر الباسورد!');
        }

        $managerPassword = env('MANAGER_SEED_PASSWORD', str()->random(16));

        User::firstOrCreate(
            ['email' => 'manager@manager.com'],
            [
                'name' => 'أحمد المدير (Manager)',
                'password' => Hash::make($managerPassword),
                'role' => 'manager',
                'is_active' => true,
                'points_balance' => 5000,
                'initial_monthly_balance' => 5000,
            ]
        );

        if (empty(env('MANAGER_SEED_PASSWORD'))) {
            $this->command?->warn("⚠️  MANAGER_SEED_PASSWORD غير معرف في .env — تم إنشاء باسورد عشوائي: {$managerPassword}");
            $this->command?->warn('⚠️  سجّل الدخول فوراً وغيّر الباسورد!');
        }
    }
}
