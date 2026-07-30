<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug', 190)->unique();
            $table->text('description')->nullable();
            $table->foreignId('type_id')->constrained('unit_types')->cascadeOnDelete();
            $table->foreignId('area_id')->constrained('areas')->cascadeOnDelete();
            $table->string('transaction', 10);
            $table->decimal('price', 15, 2);
            $table->decimal('area_sqm', 10, 2)->nullable();
            $table->integer('rooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->integer('floor')->nullable();
            $table->string('alt_text', 255)->nullable();
            $table->string('video_url', 500)->nullable();
            $table->string('video_path', 500)->nullable();
            $table->decimal('location_lat', 10, 7)->nullable();
            $table->decimal('location_lng', 10, 7)->nullable();
            $table->string('location_address', 500)->nullable();
            $table->json('keywords')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->integer('priority_points')->default(0);
            $table->boolean('is_pinned')->default(false);
            $table->index('is_pinned');
            $table->boolean('is_deal')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('views_count')->default(0);
            $table->timestamp('auto_delete_at')->nullable();
            $table->timestamps();

            $table->index('project_id');
            $table->index('user_id');
            $table->index('type_id');
            $table->index('area_id');
            $table->index('transaction');
            $table->index('price');
            $table->index(['priority_points', 'is_pinned']);
            $table->index('is_deal');
            $table->index('is_active');
            $table->index(['created_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
