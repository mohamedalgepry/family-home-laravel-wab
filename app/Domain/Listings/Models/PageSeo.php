<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class PageSeo extends Model
{
    protected $table = 'page_seo';

    protected $fillable = [
        'page_key',
        'meta_title_ar',
        'meta_title_en',
        'meta_description_ar',
        'meta_description_en',
        'meta_keywords_ar',
        'meta_keywords_en',
    ];

    protected function casts(): array
    {
        return [
            'meta_keywords_ar' => 'array',
            'meta_keywords_en' => 'array',
        ];
    }
}
