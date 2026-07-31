<?php

namespace App\Domain\Common\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait ByAnySlug
{
    public function scopeByAnySlug(Builder $query, string $slug): Builder
    {
        return $query->where(function (Builder $q) use ($slug) {
            $q->where('slug', $slug)
                ->orWhere('slug_ar', $slug)
                ->orWhere('slug_en', $slug);
        });
    }

    protected function ensureUniqueSlugs(): void
    {
        foreach (['slug', 'slug_ar', 'slug_en'] as $field) {
            if (! $this->$field) {
                continue;
            }
            $base = $this->$field;
            $suffix = 1;
            while (static::where($field, $this->$field)->where('id', '!=', $this->id)->exists()) {
                $this->$field = $base.'-'.$suffix++;
            }
        }
    }
}
