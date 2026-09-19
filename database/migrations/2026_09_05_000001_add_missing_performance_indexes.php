<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // AUDIT-DB-001: scopeOrderByFeatured() يرتب بـ priority_points بدون index
        try {
            Schema::table('units', function (Blueprint $table) {
                $table->index('priority_points', 'units_priority_points_idx');
            });
        } catch (\Throwable $e) {}

        // AUDIT-DB-002: scopeDeals() يفلتر بـ is_active + is_deal بدون composite index
        try {
            Schema::table('units', function (Blueprint $table) {
                $table->index(['is_active', 'is_deal'], 'units_active_deal_idx');
            });
        } catch (\Throwable $e) {}
    }

    public function down(): void
    {
        try {
            Schema::table('units', function (Blueprint $table) {
                $table->dropIndex('units_priority_points_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('units', function (Blueprint $table) {
                $table->dropIndex('units_active_deal_idx');
            });
        } catch (\Throwable $e) {}
    }
};
