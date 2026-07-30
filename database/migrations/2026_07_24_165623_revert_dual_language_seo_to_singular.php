<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('article_images', function (Blueprint $table) {
            $table->dropColumn(['alt_text_ar', 'alt_text_en']);
            $table->string('alt_text')->nullable()->after('path');
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn([
                'alt_text_ar', 'alt_text_en',
                'keywords_ar', 'keywords_en',
                'meta_description_ar', 'meta_description_en',
            ]);
            $table->string('alt_text')->nullable()->after('excerpt_en');
            $table->text('keywords')->nullable()->after('alt_text');
            $table->string('meta_description', 500)->nullable()->after('keywords');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_images', function (Blueprint $table) {
            $table->dropColumn('alt_text');
            $table->string('alt_text_ar')->nullable()->after('path');
            $table->string('alt_text_en')->nullable()->after('alt_text_ar');
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['alt_text', 'keywords', 'meta_description']);
            $table->string('alt_text_ar')->nullable()->after('excerpt_en');
            $table->string('alt_text_en')->nullable()->after('alt_text_ar');
            $table->text('keywords_ar')->nullable()->after('alt_text_en');
            $table->text('keywords_en')->nullable()->after('keywords_ar');
            $table->string('meta_description_ar', 500)->nullable()->after('keywords_en');
            $table->string('meta_description_en', 500)->nullable()->after('meta_description_ar');
        });
    }
};
