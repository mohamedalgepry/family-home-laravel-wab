<?php

use App\Domain\Common\Support\SlugHelper;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Services\SitemapService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('articles')) {
            return;
        }

        $articles = Article::all();
        foreach ($articles as $article) {
            $titleAr = $article->title_ar ?: $article->title;
            $titleEn = $article->title_en ?: $article->title;

            $slugEn = SlugHelper::makeEnglish($titleEn, 'article');
            $slugAr = SlugHelper::makeArabic($titleAr, $slugEn);

            // Ensure uniqueness for slug_ar
            $baseAr = $slugAr;
            $suffixAr = 1;
            while (Article::where('slug_ar', $slugAr)->where('id', '!=', $article->id)->exists()) {
                $slugAr = $baseAr.'-'.$suffixAr++;
            }

            // Ensure uniqueness for slug_en
            $baseEn = $slugEn;
            $suffixEn = 1;
            while (Article::where('slug_en', $slugEn)->where('id', '!=', $article->id)->exists()) {
                $slugEn = $baseEn.'-'.$suffixEn++;
            }

            $article->timestamps = false;
            $article->update([
                'slug' => $slugEn,
                'slug_ar' => $slugAr,
                'slug_en' => $slugEn,
            ]);
        }

        try {
            app(SitemapService::class)->regenerate();
        } catch (\Throwable $e) {
            // Ignore if in migration
        }
    }

    public function down(): void
    {
        // Non-destructive reverse
    }
};
