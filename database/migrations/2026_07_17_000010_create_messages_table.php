<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('units')->cascadeOnDelete();
            $table->foreignId('agent_id')->constrained('users')->cascadeOnDelete();
            $table->string('client_name');
            $table->string('client_phone', 20)->nullable();
            $table->string('client_email')->nullable();
            $table->text('content');
            $table->string('status', 10)->default('pending');
            $table->timestamp('replied_at')->nullable();
            $table->timestamps();

            $table->index('unit_id');
            $table->index('agent_id');
            $table->index('status');
            $table->index(['created_at', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
