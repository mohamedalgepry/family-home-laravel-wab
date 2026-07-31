<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->index('auto_delete_at', 'units_auto_delete_at_idx');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->index('auto_delete_at', 'projects_auto_delete_at_idx');
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropIndex('units_auto_delete_at_idx');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex('projects_auto_delete_at_idx');
        });
    }
};
