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
        Schema::table('units', function (Blueprint $table) {
            $table->text('map_embed_url')->nullable()->after('video_path');
            $table->dropColumn(['location_lat', 'location_lng']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn('map_embed_url');
            $table->decimal('location_lat', 10, 7)->nullable()->after('video_path');
            $table->decimal('location_lng', 10, 7)->nullable()->after('location_lat');
        });
    }
};
