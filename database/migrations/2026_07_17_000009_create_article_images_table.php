<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->string('path', 500);
            $table->string('alt_text', 255)->nullable();
            $table->string('position', 10)->default('inside');
            $table->string('size', 10)->default('medium');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('article_id');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_images');
    }
};
