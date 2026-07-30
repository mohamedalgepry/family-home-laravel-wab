<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            ['name_ar' => 'مدينة نصر', 'name_en' => 'Nasr City', 'slug' => 'nasr-city'],
            ['name_ar' => 'الشيخ زايد', 'name_en' => 'Sheikh Zayed', 'slug' => 'sheikh-zayed'],
            ['name_ar' => 'التجمع الخامس', 'name_en' => 'New Cairo', 'slug' => 'new-cairo'],
            ['name_ar' => 'المهندسين', 'name_en' => 'Mohandessin', 'slug' => 'mohandessin'],
            ['name_ar' => 'الاسكندرية', 'name_en' => 'Alexandria', 'slug' => 'alexandria'],
            ['name_ar' => 'العاصمة الإدارية', 'name_en' => 'New Administrative Capital', 'slug' => 'new-administrative-capital'],
            ['name_ar' => 'المعادي', 'name_en' => 'Maadi', 'slug' => 'maadi'],
            ['name_ar' => '6 أكتوبر', 'name_en' => '6th October', 'slug' => '6th-october'],
            ['name_ar' => 'الرحاب', 'name_en' => 'Rehab', 'slug' => 'rehab'],
            ['name_ar' => 'العين السخنة', 'name_en' => 'Ain Sokhna', 'slug' => 'ain-sokhna'],
        ];

        foreach ($areas as $area) {
            DB::table('areas')->updateOrInsert(['slug' => $area['slug']], $area);
        }
    }
}
