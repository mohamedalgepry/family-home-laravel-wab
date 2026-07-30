<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->enum('payment_method', ['cash', 'installment', 'both'])->nullable()->after('description_en');
            $table->decimal('down_payment', 15, 2)->nullable()->after('payment_method');
            $table->integer('installment_years')->nullable()->after('down_payment');
            $table->foreignId('finishing_type_id')->nullable()->after('installment_years')->constrained('finishing_types')->nullOnDelete();
        });

        Schema::table('units', function (Blueprint $table) {
            $table->enum('payment_method', ['cash', 'installment', 'both'])->nullable()->after('rooms');
            $table->decimal('down_payment', 15, 2)->nullable()->after('payment_method');
            $table->integer('installment_years')->nullable()->after('down_payment');
            $table->foreignId('finishing_type_id')->nullable()->after('installment_years')->constrained('finishing_types')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['finishing_type_id']);
            $table->dropColumn(['payment_method', 'down_payment', 'installment_years', 'finishing_type_id']);
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropForeign(['finishing_type_id']);
            $table->dropColumn(['payment_method', 'down_payment', 'installment_years', 'finishing_type_id']);
        });
    }
};
