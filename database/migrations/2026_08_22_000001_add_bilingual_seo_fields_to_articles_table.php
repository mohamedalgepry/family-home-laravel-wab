<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (! Schema::hasColumn('articles', 'alt_text_ar')) {
                $table->string('alt_text_ar', 500)->nullable()->after('excerpt_en');
            }
            if (! Schema::hasColumn('articles', 'alt_text_en')) {
                $table->string('alt_text_en', 500)->nullable()->after('alt_text_ar');
            }
            if (! Schema::hasColumn('articles', 'keywords_ar')) {
                $table->json('keywords_ar')->nullable()->after('alt_text_en');
            }
            if (! Schema::hasColumn('articles', 'keywords_en')) {
                $table->json('keywords_en')->nullable()->after('keywords_ar');
            }
            if (! Schema::hasColumn('articles', 'meta_description_ar')) {
                $table->string('meta_description_ar', 500)->nullable()->after('keywords_en');
            }
            if (! Schema::hasColumn('articles', 'meta_description_en')) {
                $table->string('meta_description_en', 500)->nullable()->after('meta_description_ar');
            }
        });

        // Copy existing single-language data into the Arabic fields so nothing is lost
        if (Schema::hasColumn('articles', 'meta_description') && Schema::hasColumn('articles', 'meta_description_ar')) {
            DB::statement('UPDATE articles SET meta_description_ar = meta_description WHERE meta_description_ar IS NULL AND meta_description IS NOT NULL');
        }
        if (Schema::hasColumn('articles', 'keywords') && Schema::hasColumn('articles', 'keywords_ar')) {
            DB::statement('UPDATE articles SET keywords_ar = keywords WHERE keywords_ar IS NULL AND keywords IS NOT NULL');
        }
        if (Schema::hasColumn('articles', 'alt_text') && Schema::hasColumn('articles', 'alt_text_ar')) {
            DB::statement('UPDATE articles SET alt_text_ar = alt_text WHERE alt_text_ar IS NULL AND alt_text IS NOT NULL');
        }
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['alt_text_ar', 'alt_text_en', 'keywords_ar', 'keywords_en', 'meta_description_ar', 'meta_description_en'] as $col) {
                if (Schema::hasColumn('articles', $col)) {
                    $columnsToDrop[] = $col;
                }
            }
            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
