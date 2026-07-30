<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->string('name_ar', 255)->nullable()->after('name');
            $table->string('name_en', 255)->nullable()->after('name_ar');
            $table->text('description_ar')->nullable()->after('description');
            $table->text('description_en')->nullable()->after('description_ar');
        });

        DB::statement('UPDATE units SET name_en = name, description_en = description');

        Schema::table('projects', function (Blueprint $table) {
            $table->string('name_ar', 255)->nullable()->after('name');
            $table->string('name_en', 255)->nullable()->after('name_ar');
            $table->text('description_ar')->nullable()->after('description');
            $table->text('description_en')->nullable()->after('description_ar');
        });

        DB::statement('UPDATE projects SET name_en = name, description_en = description');

        Schema::table('articles', function (Blueprint $table) {
            $table->string('title_ar', 500)->nullable()->after('title');
            $table->string('title_en', 500)->nullable()->after('title_ar');
            $table->longText('content_ar')->nullable()->after('content');
            $table->longText('content_en')->nullable()->after('content_ar');
            $table->text('excerpt_ar')->nullable()->after('excerpt');
            $table->text('excerpt_en')->nullable()->after('excerpt_ar');
        });

        DB::statement('UPDATE articles SET title_en = title, content_en = content, excerpt_en = excerpt');
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn(['name_ar', 'name_en', 'description_ar', 'description_en']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['name_ar', 'name_en', 'description_ar', 'description_en']);
        });

        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['title_ar', 'title_en', 'content_ar', 'content_en', 'excerpt_ar', 'excerpt_en']);
        });
    }
};
