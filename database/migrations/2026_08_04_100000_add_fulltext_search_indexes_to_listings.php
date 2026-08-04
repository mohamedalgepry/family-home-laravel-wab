<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * تضيف هذه الـ Migration فهرسًا FULLTEXT على أعمدة البحث النصي
     * في جدولَي units و projects.
     *
     * FULLTEXT مدعوم على InnoDB من MySQL 5.6+ وMariaDB 10.0+.
     * يُحسّن البحث النصي بشكل جذري مقارنةً بـ LIKE "%term%".
     *
     * ملاحظة: لن تُنفَّذ إلا على MySQL/MariaDB. SQLite لا يدعم FULLTEXT
     * وهو مستخدم فقط للاختبارات — انظر phpunit.xml.
     */
    public function up(): void
    {
        // نتخطى تنفيذ هذه الـ migration إذا لم نكن على MySQL/MariaDB
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        try {
            Schema::table('units', function (Blueprint $table) {
                $table->fullText(
                    ['name_ar', 'name_en', 'description_ar', 'description_en'],
                    'units_fulltext_search_idx'
                );
            });
        } catch (\Throwable $e) {
            // الفهرس موجود بالفعل أو المحرك لا يدعمه — نتجاهل الخطأ
        }

        try {
            Schema::table('projects', function (Blueprint $table) {
                $table->fullText(
                    ['name_ar', 'name_en', 'description_ar', 'description_en'],
                    'projects_fulltext_search_idx'
                );
            });
        } catch (\Throwable $e) {
            // الفهرس موجود بالفعل أو المحرك لا يدعمه — نتجاهل الخطأ
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        try {
            Schema::table('units', function (Blueprint $table) {
                $table->dropFullText('units_fulltext_search_idx');
            });
        } catch (\Throwable $e) {
        }

        try {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropFullText('projects_fulltext_search_idx');
            });
        } catch (\Throwable $e) {
        }
    }
};
