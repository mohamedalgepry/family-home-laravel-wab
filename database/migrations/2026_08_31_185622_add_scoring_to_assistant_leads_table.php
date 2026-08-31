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
        Schema::table('assistant_leads', function (Blueprint $table) {
            $table->unsignedTinyInteger('lead_score')->default(0)->after('last_active_at');
            $table->string('lead_status')->default('normal')->after('lead_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assistant_leads', function (Blueprint $table) {
            $table->dropColumn(['lead_score', 'lead_status']);
        });
    }
};
