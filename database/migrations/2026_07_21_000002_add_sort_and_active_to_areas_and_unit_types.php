<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('slug');
            $table->integer('sort_order')->default(0)->after('is_active');
        });

        Schema::table('unit_types', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('slug');
            $table->integer('sort_order')->default(0)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('areas', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'sort_order']);
        });

        Schema::table('unit_types', function (Blueprint $table) {
            $table->dropColumn(['is_active', 'sort_order']);
        });
    }
};
