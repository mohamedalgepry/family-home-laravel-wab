<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Validates that a URL uses a safe scheme (https, http) or is a relative path.
 * Blocks dangerous schemes like javascript:, data:, vbscript:, etc.
 */
class SafeUrl implements ValidationRule
{
    private const ALLOWED_SCHEMES = ['https', 'http'];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $value = trim($value);

        // Allow relative URLs starting with /
        if (str_starts_with($value, '/') && ! str_starts_with($value, '//')) {
            return;
        }

        // Parse the scheme
        $parsed = parse_url($value);
        $scheme = strtolower($parsed['scheme'] ?? '');

        if ($scheme === '' || ! in_array($scheme, self::ALLOWED_SCHEMES, true)) {
            $fail(__('validation.url'));
        }
    }
}
