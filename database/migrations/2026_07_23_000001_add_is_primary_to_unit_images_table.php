<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('unit_images', function (Blueprint $table) {
            $table->boolean('is_primary')->default(false)->after('sort_order');
            $table->index('is_primary');
        });
    }

    public function down(): void
    {
        Schema::table('unit_images', function (Blueprint $table) {
            $table->dropIndex(['is_primary']);
            $table->dropColumn('is_primary');
        });
    }
};
