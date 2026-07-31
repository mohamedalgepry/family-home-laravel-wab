<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::table('units', function (Blueprint $table) {
                $table->index(['is_active', 'is_pinned', 'created_at'], 'units_active_pinned_created_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('units', function (Blueprint $table) {
                $table->index(['is_active', 'type_id', 'area_id'], 'units_active_type_area_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('units', function (Blueprint $table) {
                $table->index(['is_active', 'price'], 'units_active_price_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('projects', function (Blueprint $table) {
                $table->index(['is_active', 'created_at'], 'projects_active_created_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('projects', function (Blueprint $table) {
                $table->index(['is_active', 'area_id'], 'projects_active_area_idx');
            });
        } catch (\Throwable $e) {}
    }

    public function down(): void
    {
        try {
            Schema::table('units', function (Blueprint $table) {
                $table->dropIndex('units_active_pinned_created_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('units', function (Blueprint $table) {
                $table->dropIndex('units_active_type_area_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('units', function (Blueprint $table) {
                $table->dropIndex('units_active_price_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropIndex('projects_active_created_idx');
            });
        } catch (\Throwable $e) {}

        try {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropIndex('projects_active_area_idx');
            });
        } catch (\Throwable $e) {}
    }
};
