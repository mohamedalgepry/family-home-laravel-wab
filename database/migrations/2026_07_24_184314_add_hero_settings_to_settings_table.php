<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('settings')->insert([
            ['key' => 'hero_title_ar', 'value' => 'ابحث عن منزل أحلامك'],
            ['key' => 'hero_title_en', 'value' => 'Search for your dream home'],
            ['key' => 'hero_subtitle_ar', 'value' => 'آلاف العقارات في جميع أنحاء المملكة'],
            ['key' => 'hero_subtitle_en', 'value' => 'Thousands of properties across the kingdom'],
            ['key' => 'hero_image', 'value' => null],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'hero_title_ar',
            'hero_title_en',
            'hero_subtitle_ar',
            'hero_subtitle_en',
            'hero_image',
        ])->delete();
    }
};
