<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('viewable_type', 80);
            $table->unsignedBigInteger('viewable_id');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('visited_at')->useCurrent();

            $table->index(['viewable_type', 'viewable_id']);
            $table->index('visited_at');
            $table->index(['viewable_type', 'viewable_id', 'ip_address', 'visited_at'], 'page_views_dedup_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
