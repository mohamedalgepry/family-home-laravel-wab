<?php

namespace App\Rules;

use App\Support\IconAllowlist;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Ensures an icon value is a plain allowlisted icon name and rejects any
 * markup/URL (e.g. "<svg onload=...>", "javascript:", "data:").
 */
class AllowedIconName implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! IconAllowlist::isAllowed($value)) {
            $fail(__('common.invalid_icon_name') ?: 'Invalid icon: only safe, allowlisted icon names are permitted.');
        }
    }
}