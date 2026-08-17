<?php

namespace App\Http\Requests\Admin\Concerns;

use App\Domain\Common\Support\Sanitizer;

trait HasMapEmbedRule
{
    protected function mapEmbedUrlRule(): array
    {
        return [
            'nullable',
            'string',
            'url',
            'max:2000',
            function (string $attribute, mixed $value, \Closure $fail) {
                if (! Sanitizer::isValidMapEmbed($value)) {
                    $fail(__('validation.invalid_map_url'));
                }
            },
        ];
    }
}
