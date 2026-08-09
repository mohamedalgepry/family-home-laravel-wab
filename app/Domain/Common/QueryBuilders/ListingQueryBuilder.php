<?php

namespace App\Domain\Common\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ListingQueryBuilder
{
    public static function applyExactMatches(Builder $query, array $filters, array $fields): void
    {
        foreach ($fields as $field) {
            if (! empty($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }
    }

    public static function applyBoolean(Builder $query, array $filters, string $field): void
    {
        if (empty($filters[$field])) {
            return;
        }

        $value = $filters[$field];
        $query->where($field, $value === 'true' || $value === true);
    }

    public static function applyRange(Builder $query, array $filters, string $column, string $minKey, string $maxKey): void
    {
        if (! empty($filters[$minKey])) {
            $query->where($column, '>=', $filters[$minKey]);
        }

        if (! empty($filters[$maxKey])) {
            $query->where($column, '<=', $filters[$maxKey]);
        }
    }

    public static function applySearch(Builder $query, array $filters, array $fields, ?string $relation = null, int $minLength = 0): void
    {
        $search = $filters['search'] ?? null;

        if (empty($search) || strlen((string) $search) < $minLength) {
            return;
        }

        // تهريب عمليات MySQL boolean FULLTEXT ( + - > < ( ) ~ * " @ ) حتى لا تُفسَّر كعوامل
        // عند تمريرها مباشرة إلى AGAINST. إزالتها تحافظ على سلوك بحث نصي عادي دون أخطاء.
        $fulltextTerm = self::sanitizeFulltextTerm((string) $search);

        // تهريب الـ wildcards في LIKE حتى لا يتمكن المستخدم من استخدام % أو _ كجوكر
        $likeTerm = str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], (string) $search);

        // الأعمدة التي عليها FULLTEXT index (units و projects)
        $fulltextColumns = ['name_ar', 'name_en', 'description_ar', 'description_en'];

        // الأعمدة الأخرى في قائمة الفلتر (slugs) — مفهرسة بـ unique، تبقى بـ LIKE
        $slugFields = array_values(array_diff($fields, $fulltextColumns));

        // نستخدم FULLTEXT فقط إذا كانت قاعدة البيانات MySQL والفهرس موجود فعلياً
        $table = $query->getModel()->getTable();
        $useFulltext = self::hasFulltextIndex($table)
            && count(array_intersect($fields, $fulltextColumns)) > 0;

        $query->where(function (Builder $q) use ($search, $fulltextTerm, $likeTerm, $fields, $slugFields, $fulltextColumns, $useFulltext, $relation) {
            if ($useFulltext && $fulltextTerm !== '') {
                // FULLTEXT بحث سريع على الأعمدة النصية الرئيسية
                $q->whereFullText($fulltextColumns, $fulltextTerm);

                // Slug fields: LIKE بدون wildcard في البداية للاستفادة من الـ unique index
                foreach ($slugFields as $field) {
                    $q->orWhere($field, 'like', "{$likeTerm}%");
                }
            } else {
                // Fallback لـ SQLite (بيئة الاختبار) أو في حال عدم وجود الفهرس على MySQL
                foreach ($fields as $field) {
                    $q->orWhere($field, 'like', "%{$likeTerm}%");
                }
            }

            // البحث في اسم المشروع/الوحدة المرتبطة — يبقى كما هو (جدول مختلف)
            if ($relation) {
                $q->orWhereHas($relation, function (Builder $rel) use ($likeTerm) {
                    $rel->where('name_en', 'like', "%{$likeTerm}%")
                        ->orWhere('name_ar', 'like', "%{$likeTerm}%");
                });
            }
        });
    }

    private static function sanitizeFulltextTerm(string $term): string
    {
        $term = preg_replace('/[+\-<>()~*"@]/u', ' ', $term);
        $term = preg_replace('/\s+/u', ' ', $term);

        return trim($term);
    }

    private static function hasFulltextIndex(string $table): bool
    {
        if (DB::getDriverName() !== 'mysql') {
            return false;
        }

        try {
            return Cache::remember("fulltext_idx_exists_{$table}", 3600, function () use ($table) {
                $indexes = DB::select("SHOW INDEX FROM `{$table}` WHERE Index_type = 'FULLTEXT'");
                return ! empty($indexes);
            });
        } catch (\Throwable $e) {
            return false;
        }
    }


    public static function applySort(Builder $query, array $filters, array $allowedSorts, ?string $defaultSort = null): bool
    {
        $sortField = $filters['sort'] ?? $defaultSort;
        $sortDir = $filters['direction'] ?? 'desc';

        if (! in_array($sortField, $allowedSorts)) {
            return false;
        }

        $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');

        return true;
    }

    public static function perPage(array $filters, int $default = 15, int $max = 50): int
    {
        return min((int) ($filters['per_page'] ?? $default), $max);
    }
}
