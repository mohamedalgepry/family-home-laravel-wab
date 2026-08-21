<?php

use App\Domain\Common\Support\SlugHelper;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\SitemapService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Regenerate for Units
        if (Schema::hasTable('units')) {
            $units = Unit::all();
            foreach ($units as $unit) {
                $nameAr = $unit->name_ar ?: $unit->name;
                $nameEn = $unit->name_en ?: $unit->name;

                $slugEn = SlugHelper::makeEnglish($nameEn, 'unit');
                $slugAr = SlugHelper::makeArabic($nameAr, $slugEn);

                $baseAr = $slugAr;
                $suffixAr = 1;
                while (Unit::where('slug_ar', $slugAr)->where('id', '!=', $unit->id)->exists()) {
                    $slugAr = $baseAr.'-'.$suffixAr++;
                }

                $baseEn = $slugEn;
                $suffixEn = 1;
                while (Unit::where('slug_en', $slugEn)->where('id', '!=', $unit->id)->exists()) {
                    $slugEn = $baseEn.'-'.$suffixEn++;
                }

                $unit->timestamps = false;
                $unit->update([
                    'slug' => $slugEn,
                    'slug_ar' => $slugAr,
                    'slug_en' => $slugEn,
                ]);
            }
        }

        // 2. Regenerate for Projects
        if (Schema::hasTable('projects')) {
            $projects = Project::all();
            foreach ($projects as $project) {
                $nameAr = $project->name_ar ?: $project->name;
                $nameEn = $project->name_en ?: $project->name;

                $slugEn = SlugHelper::makeEnglish($nameEn, 'project');
                $slugAr = SlugHelper::makeArabic($nameAr, $slugEn);

                $baseAr = $slugAr;
                $suffixAr = 1;
                while (Project::where('slug_ar', $slugAr)->where('id', '!=', $project->id)->exists()) {
                    $slugAr = $baseAr.'-'.$suffixAr++;
                }

                $baseEn = $slugEn;
                $suffixEn = 1;
                while (Project::where('slug_en', $slugEn)->where('id', '!=', $project->id)->exists()) {
                    $slugEn = $baseEn.'-'.$suffixEn++;
                }

                $project->timestamps = false;
                $project->update([
                    'slug' => $slugEn,
                    'slug_ar' => $slugAr,
                    'slug_en' => $slugEn,
                ]);
            }
        }

        // 3. Regenerate for Categories
        if (Schema::hasTable('categories')) {
            $categories = Category::all();
            foreach ($categories as $category) {
                $nameAr = $category->name_ar ?: $category->name;
                $nameEn = $category->name_en ?: $category->name;

                $slugEn = SlugHelper::makeEnglish($nameEn, 'category');
                $slugAr = SlugHelper::makeArabic($nameAr, $slugEn);

                $baseAr = $slugAr;
                $suffixAr = 1;
                while (Category::where('slug_ar', $slugAr)->where('id', '!=', $category->id)->exists()) {
                    $slugAr = $baseAr.'-'.$suffixAr++;
                }

                $baseEn = $slugEn;
                $suffixEn = 1;
                while (Category::where('slug_en', $slugEn)->where('id', '!=', $category->id)->exists()) {
                    $slugEn = $baseEn.'-'.$suffixEn++;
                }

                $category->timestamps = false;
                $category->update([
                    'slug' => $slugEn,
                    'slug_ar' => $slugAr,
                    'slug_en' => $slugEn,
                ]);
            }
        }

        try {
            app(SitemapService::class)->regenerate();
        } catch (\Throwable $e) {
            // Ignore if in testing or migration
        }
    }

    public function down(): void
    {
        // Non-destructive reverse
    }
};
