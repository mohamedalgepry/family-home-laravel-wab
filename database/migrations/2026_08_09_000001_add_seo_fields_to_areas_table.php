<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->string('meta_title_ar')->nullable()->after('sort_order');
            $table->string('meta_title_en')->nullable()->after('meta_title_ar');
            $table->text('meta_description_ar')->nullable()->after('meta_title_en');
            $table->text('meta_description_en')->nullable()->after('meta_description_ar');
            $table->json('meta_keywords_ar')->nullable()->after('meta_description_en');
            $table->json('meta_keywords_en')->nullable()->after('meta_keywords_ar');
            $table->string('image_path')->nullable()->after('meta_keywords_en');
        });
    }

    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropColumn([
                'meta_title_ar',
                'meta_title_en',
                'meta_description_ar',
                'meta_description_en',
                'meta_keywords_ar',
                'meta_keywords_en',
                'image_path',
            ]);
        });
    }
};
