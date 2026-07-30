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
        Schema::table('units', function (Blueprint $table) {
            $table->string('slug_ar', 255)->nullable()->after('slug')->unique();
            $table->string('slug_en', 255)->nullable()->after('slug_ar')->unique();
        });

        DB::statement("UPDATE units SET slug_ar = CONCAT(slug, '-ar'), slug_en = slug");

        Schema::table('projects', function (Blueprint $table) {
            $table->string('slug_ar', 255)->nullable()->after('slug')->unique();
            $table->string('slug_en', 255)->nullable()->after('slug_ar')->unique();
        });

        DB::statement("UPDATE projects SET slug_ar = CONCAT(slug, '-ar'), slug_en = slug");

        Schema::table('articles', function (Blueprint $table) {
            $table->string('slug_ar', 255)->nullable()->after('slug')->unique();
            $table->string('slug_en', 255)->nullable()->after('slug_ar')->unique();
        });

        DB::statement("UPDATE articles SET slug_ar = CONCAT(slug, '-ar'), slug_en = slug");

        Schema::table('categories', function (Blueprint $table) {
            $table->string('slug_ar', 255)->nullable()->after('slug')->unique();
            $table->string('slug_en', 255)->nullable()->after('slug_ar')->unique();
        });

        DB::statement("UPDATE categories SET slug_ar = CONCAT(slug, '-ar'), slug_en = slug");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn(['slug_ar', 'slug_en']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['slug_ar', 'slug_en']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['slug_ar', 'slug_en']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['slug_ar', 'slug_en']);
        });
    }
};
