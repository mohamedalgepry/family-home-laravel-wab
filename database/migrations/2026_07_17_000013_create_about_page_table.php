<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_page', function (Blueprint $table) {
            $table->id();
            $table->longText('content_ar')->nullable();
            $table->longText('content_en')->nullable();
            $table->json('images')->nullable();
            $table->timestamp('updated_at')->useCurrent();
        });

        DB::table('about_page')->insert([
            'content_ar' => null,
            'content_en' => null,
            'images' => null,
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('about_page');
    }
};
