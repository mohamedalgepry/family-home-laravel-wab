<?php

$areas = require 'temp_areas.php';

$out = "<?php\n\nnamespace Database\Seeders;\n\nuse Illuminate\Database\Seeder;\nuse App\Domain\Listings\Models\Area;\nuse Illuminate\Support\Facades\DB;\n\nclass FamilyHomeAreasSeeder extends Seeder\n{\n    public function run(): void\n    {\n        DB::table('areas')->truncate();\n\n        \$areas = [\n";

foreach ($areas as $area) {
    // Add missing fields
    $meta_title_ar = 'عقارات ' . $area['name_ar'] . ' | استثمار وسكن';
    $meta_title_en = 'Real Estate in ' . $area['name_en'] . ' | Invest & Live';
    
    $meta_desc_ar = $area['short_description_ar'];
    $meta_desc_en = $area['short_description_en'];
    
    $keywords_ar = json_encode(['عقارات', 'استثمار', 'شقق', 'فيلات', $area['name_ar']], JSON_UNESCAPED_UNICODE);
    $keywords_en = json_encode(['Real Estate', 'Investment', 'Apartments', 'Villas', $area['name_en']]);

    $hero_title_ar = 'اكتشف أفضل العقارات في ' . $area['name_ar'];
    $hero_title_en = 'Discover the Best Properties in ' . $area['name_en'];
    
    $hero_desc_ar = 'تصفح أحدث المشاريع والوحدات السكنية والتجارية في ' . $area['name_ar'] . ' وتواصل مع أفضل الوكلاء.';
    $hero_desc_en = 'Browse the latest residential and commercial projects and units in ' . $area['name_en'] . ' and connect with top agents.';

    $image_path = 'areas/' . $area['slug'] . '.webp';
    $hero_image = 'areas/hero-' . $area['slug'] . '.webp';
    $gallery = json_encode([$image_path]);

    $out .= "            [\n";
    foreach ($area as $key => $val) {
        $escaped = str_replace("'", "\'", $val);
        $out .= "                '$key' => '$escaped',\n";
    }
    $out .= "                'meta_title_ar' => '$meta_title_ar',\n";
    $out .= "                'meta_title_en' => '$meta_title_en',\n";
    $out .= "                'meta_description_ar' => '" . str_replace("'", "\'", $meta_desc_ar) . "',\n";
    $out .= "                'meta_description_en' => '" . str_replace("'", "\'", $meta_desc_en) . "',\n";
    $out .= "                'meta_keywords_ar' => '$keywords_ar',\n";
    $out .= "                'meta_keywords_en' => '$keywords_en',\n";
    $out .= "                'image_path' => '$image_path',\n";
    $out .= "                'hero_title_ar' => '$hero_title_ar',\n";
    $out .= "                'hero_title_en' => '$hero_title_en',\n";
    $out .= "                'hero_description_ar' => '" . str_replace("'", "\'", $hero_desc_ar) . "',\n";
    $out .= "                'hero_description_en' => '" . str_replace("'", "\'", $hero_desc_en) . "',\n";
    $out .= "                'hero_image' => '$hero_image',\n";
    $out .= "                'gallery' => '$gallery',\n";
    $out .= "                'parent_id' => null,\n";
    $out .= "                'is_active' => true,\n";
    $out .= "            ],\n";
}

$out .= <<<EOT
        ];

        foreach (\$areas as \$area) {
            Area::updateOrCreate(
                ['slug' => \$area['slug']],
                \$area
            );
        }
    }
}
EOT;

file_put_contents('database/seeders/FamilyHomeAreasSeeder.php', $out);
echo "Done generating seeder\n";
