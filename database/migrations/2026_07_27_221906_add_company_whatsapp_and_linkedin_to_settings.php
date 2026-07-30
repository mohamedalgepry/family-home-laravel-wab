<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('settings')->insertOrIgnore([
            ['key' => 'company_whatsapp', 'value' => null],
            ['key' => 'social_linkedin', 'value' => null],
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', ['company_whatsapp', 'social_linkedin'])->delete();
    }
};
