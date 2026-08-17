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
        Schema::table('areas', function (Blueprint $table) {
            $table->text('short_description_ar')->nullable();
            $table->text('short_description_en')->nullable();
            $table->string('hero_title_ar')->nullable();
            $table->string('hero_title_en')->nullable();
            $table->text('hero_description_ar')->nullable();
            $table->text('hero_description_en')->nullable();
            $table->string('hero_image')->nullable();
            $table->json('gallery')->nullable();
            $table->longText('about_ar')->nullable();
            $table->longText('about_en')->nullable();
            $table->string('address_ar')->nullable();
            $table->string('address_en')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('map_url')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('areas')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn([
                'short_description_ar', 'short_description_en',
                'hero_title_ar', 'hero_title_en',
                'hero_description_ar', 'hero_description_en',
                'hero_image', 'gallery',
                'about_ar', 'about_en',
                'address_ar', 'address_en',
                'latitude', 'longitude', 'map_url',
                'parent_id',
            ]);
        });
    }
};
