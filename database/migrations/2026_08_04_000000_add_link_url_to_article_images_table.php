<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('article_images', 'link_url')) {
            Schema::table('article_images', function (Blueprint $table) {
                $table->string('link_url', 500)->nullable()->after('alt_text');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('article_images', 'link_url')) {
            Schema::table('article_images', function (Blueprint $table) {
                $table->dropColumn('link_url');
            });
        }
    }
};
