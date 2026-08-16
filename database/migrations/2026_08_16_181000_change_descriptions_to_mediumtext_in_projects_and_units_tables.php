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
            $table->mediumText('description')->nullable()->change();
            $table->mediumText('description_ar')->nullable()->change();
            $table->mediumText('description_en')->nullable()->change();
        });

        Schema::table('units', function (Blueprint $table) {
            $table->mediumText('description')->nullable()->change();
            $table->mediumText('description_ar')->nullable()->change();
            $table->mediumText('description_en')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->text('description')->nullable()->change();
            $table->text('description_ar')->nullable()->change();
            $table->text('description_en')->nullable()->change();
        });

        Schema::table('units', function (Blueprint $table) {
            $table->text('description')->nullable()->change();
            $table->text('description_ar')->nullable()->change();
            $table->text('description_en')->nullable()->change();
        });
    }
};
