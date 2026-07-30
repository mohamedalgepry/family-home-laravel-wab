<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    public $timestamps = false;

    protected $fillable = ['viewable_type', 'viewable_id', 'ip_address', 'user_agent', 'visited_at'];

    protected function casts(): array
    {
        return ['visited_at' => 'datetime'];
    }

    public function viewable()
    {
        return $this->morphTo();
    }
}
