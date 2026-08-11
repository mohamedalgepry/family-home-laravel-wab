<?php

namespace App\Http\Requests\Admin\Concerns;

trait HasMapEmbedRule
{
    protected function mapEmbedUrlRule(): array
    {
        return [
            'nullable',
            'string',
            'url',
            'max:2000',
        ];
    }
}

