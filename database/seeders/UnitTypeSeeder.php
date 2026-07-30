<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name_ar' => 'سكني', 'name_en' => 'Residential', 'slug' => 'residential'],
            ['name_ar' => 'إداري', 'name_en' => 'Administrative', 'slug' => 'administrative'],
            ['name_ar' => 'طبي', 'name_en' => 'Medical', 'slug' => 'medical'],
            ['name_ar' => 'أرض خالية', 'name_en' => 'Vacant Land', 'slug' => 'vacant-land'],
            ['name_ar' => 'مبنى كامل', 'name_en' => 'Full Building', 'slug' => 'full-building'],
        ];

        foreach ($types as $type) {
            DB::table('unit_types')->updateOrInsert(['slug' => $type['slug']], $type);
        }
    }
}
