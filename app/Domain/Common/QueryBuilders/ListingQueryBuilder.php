<?php

namespace App\Domain\Common\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;

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

    public static function applySearch(Builder $query, array $filters, array $fields, ?string $relation = null, int $minLength = 0): void
    {
        $search = $filters['search'] ?? null;

        if (empty($search) || strlen((string) $search) < $minLength) {
            return;
        }

        $query->where(function (Builder $q) use ($search, $fields, $relation) {
            foreach ($fields as $field) {
                $q->orWhere($field, 'like', "%{$search}%");
            }

            if ($relation) {
                $q->orWhereHas($relation, function (Builder $rel) use ($search) {
                    $rel->where('name_en', 'like', "%{$search}%")
                        ->orWhere('name_ar', 'like', "%{$search}%");
                });
            }
        });
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
