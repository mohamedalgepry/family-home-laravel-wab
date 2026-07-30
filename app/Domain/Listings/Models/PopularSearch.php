<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class PopularSearch extends Model
{
    public $timestamps = false;

    protected $fillable = ['keyword', 'search_count', 'last_searched_at'];

    protected function casts(): array
    {
        return [
            'search_count' => 'integer',
            'last_searched_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }
}
