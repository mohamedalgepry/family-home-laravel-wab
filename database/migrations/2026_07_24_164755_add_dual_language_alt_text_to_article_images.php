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
            $table->dropColumn('alt_text');
            $table->string('alt_text_ar')->nullable()->after('path');
            $table->string('alt_text_en')->nullable()->after('alt_text_ar');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_images', function (Blueprint $table) {
            $table->dropColumn(['alt_text_ar', 'alt_text_en']);
            $table->string('alt_text')->nullable()->after('path');
        });
    }
};
