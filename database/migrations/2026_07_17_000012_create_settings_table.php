<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->text('value')->nullable();
            $table->timestamp('updated_at')->useCurrent();
        });

        DB::table('settings')->insert([
            ['key' => 'daily_deduction_enabled', 'value' => 'true'],
            ['key' => 'daily_deduction_value', 'value' => '10'],
            ['key' => 'monthly_reset_day', 'value' => '1'],
            ['key' => 'monthly_reset_auto', 'value' => 'false'],
            ['key' => 'auto_delete_days', 'value' => '30'],
            ['key' => 'max_video_size_mb', 'value' => '100'],
            ['key' => 'site_logo', 'value' => null],
            ['key' => 'company_phone', 'value' => null],
            ['key' => 'company_email', 'value' => null],
            ['key' => 'company_address', 'value' => null],
            ['key' => 'social_facebook', 'value' => null],
            ['key' => 'social_instagram', 'value' => null],
            ['key' => 'social_twitter', 'value' => null],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
