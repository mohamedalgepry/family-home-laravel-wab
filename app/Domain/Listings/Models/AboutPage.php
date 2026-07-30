<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    public $timestamps = false;

    protected $table = 'about_page';

    protected $fillable = ['content_ar', 'content_en', 'images'];

    protected function casts(): array
    {
        return ['images' => 'array'];
    }
}
