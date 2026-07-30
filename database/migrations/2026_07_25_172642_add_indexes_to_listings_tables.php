<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->index('payment_method');
            $table->index('finishing_type_id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->index('payment_method');
            $table->index('finishing_type_id');
        });
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropIndex(['payment_method']);
            $table->dropIndex(['finishing_type_id']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropIndex(['payment_method']);
            $table->dropIndex(['finishing_type_id']);
        });
    }
};
