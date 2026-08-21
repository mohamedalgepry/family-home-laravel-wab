<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Corrective migration: Change dangerous cascading foreign keys to safe alternatives.
 *
 * - units.type_id: cascadeOnDelete → restrictOnDelete (don't destroy units when a unit type is deleted)
 * - units.area_id: cascadeOnDelete → restrictOnDelete (don't destroy units when an area is deleted)
 * - units.user_id: cascadeOnDelete → restrictOnDelete (don't destroy units when a user is deleted)
 * - projects.user_id: cascadeOnDelete → restrictOnDelete (don't destroy projects when a user is deleted)
 * - points_transactions.manager_id: cascadeOnDelete → nullOnDelete (preserve financial history)
 * - points_transactions.performed_by: cascadeOnDelete → nullOnDelete (preserve audit trail)
 * - messages.unit_id: cascadeOnDelete → nullOnDelete (preserve client inquiries/leads when a unit is auto-deleted)
 * - messages.agent_id: cascadeOnDelete → nullOnDelete (preserve client inquiries/leads if an agent is deleted)
 * - articles.category_id: cascadeOnDelete → nullOnDelete (preserve articles if a category is deleted)
 */
return new class extends Migration
{
    public function up(): void
    {
        // --- units table ---
        Schema::table('units', function (Blueprint $table) {
            $table->dropForeign(['type_id']);
            $table->dropForeign(['area_id']);
            $table->dropForeign(['user_id']);

            $table->foreign('type_id')->references('id')->on('unit_types')->restrictOnDelete();
            $table->foreign('area_id')->references('id')->on('areas')->restrictOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->restrictOnDelete();
        });

        // --- projects table ---
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->restrictOnDelete();
        });

        // --- points_transactions table ---
        Schema::table('points_transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('manager_id')->nullable()->change();
        });

        Schema::table('points_transactions', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropForeign(['performed_by']);

            $table->foreign('manager_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('performed_by')->references('id')->on('users')->nullOnDelete();
        });

        // --- messages table ---
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->dropForeign(['agent_id']);

            $table->foreign('unit_id')->references('id')->on('units')->nullOnDelete();
            $table->foreign('agent_id')->references('id')->on('users')->nullOnDelete();
        });

        // --- articles table ---
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });

        Schema::table('articles', function (Blueprint $table) {
            // Must be nullable for ON DELETE SET NULL constraint in MySQL InnoDB
            $table->unsignedBigInteger('category_id')->nullable()->change();
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        // Restore original cascading behaviour (for rollback)
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->foreign('category_id')->references('id')->on('categories')->cascadeOnDelete();
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->dropForeign(['agent_id']);

            $table->foreign('unit_id')->references('id')->on('units')->cascadeOnDelete();
            $table->foreign('agent_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('points_transactions', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropForeign(['performed_by']);

            $table->foreign('manager_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('performed_by')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('points_transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('manager_id')->nullable(false)->change();
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropForeign(['type_id']);
            $table->dropForeign(['area_id']);
            $table->dropForeign(['user_id']);

            $table->foreign('type_id')->references('id')->on('unit_types')->cascadeOnDelete();
            $table->foreign('area_id')->references('id')->on('areas')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
