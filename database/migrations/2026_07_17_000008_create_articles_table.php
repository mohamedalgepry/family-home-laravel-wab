<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('title', 500);
            $table->string('slug', 190)->unique();
            $table->longText('content');
            $table->text('excerpt')->nullable();
            $table->string('alt_text', 255)->nullable();
            $table->json('keywords')->nullable();
            $table->string('meta_description', 500)->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->integer('views_count')->default(0);
            $table->timestamps();

            $table->index('category_id');
            $table->index('is_published');
            $table->index(['published_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
