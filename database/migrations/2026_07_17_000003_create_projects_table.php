<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->string('name');
            $table->string('slug', 190)->unique();
            $table->text('description')->nullable();
            $table->string('alt_text', 255)->nullable();
            $table->string('video_url', 500)->nullable();
            $table->decimal('location_lat', 10, 7)->nullable();
            $table->decimal('location_lng', 10, 7)->nullable();
            $table->string('location_address', 500)->nullable();
            $table->json('keywords')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('views_count')->default(0);
            $table->timestamps();

            $table->index('user_id');
            $table->index('area_id');
            $table->index('is_active');
            $table->index('views_count');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
