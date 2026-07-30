<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('notification_type', 50)->nullable()->after('type');
            $table->index('notification_type');
        });

        DB::statement("UPDATE notifications SET notification_type = JSON_UNQUOTE(JSON_EXTRACT(data, '$.type'))");
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['notification_type']);
            $table->dropColumn('notification_type');
        });
    }
};
