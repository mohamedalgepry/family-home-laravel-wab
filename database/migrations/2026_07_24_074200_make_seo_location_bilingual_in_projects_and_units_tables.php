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
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['location_address', 'meta_description', 'keywords']);
            $table->string('location_address_ar', 500)->nullable();
            $table->string('location_address_en', 500)->nullable();
            $table->string('meta_description_ar', 500)->nullable();
            $table->string('meta_description_en', 500)->nullable();
            $table->json('keywords_ar')->nullable();
            $table->json('keywords_en')->nullable();
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn(['location_address', 'meta_description', 'keywords']);
            $table->string('location_address_ar', 500)->nullable();
            $table->string('location_address_en', 500)->nullable();
            $table->string('meta_description_ar', 500)->nullable();
            $table->string('meta_description_en', 500)->nullable();
            $table->json('keywords_ar')->nullable();
            $table->json('keywords_en')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects_and_units_tables', function (Blueprint $table) {
            //
        });
    }
};
