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
            'max:2000',
            function ($attribute, $value, $fail) {
                if (! empty($value) && ! Sanitizer::isValidMapEmbed($value)) {
                    $fail(__('messages.map_embed_invalid'));
                }
            },
        ];
    }
}
