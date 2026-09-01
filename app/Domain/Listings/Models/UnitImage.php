<?php

namespace App\Domain\Listings\Models;

use App\Domain\Listings\Models\Concerns\HasImageAttributes;
use Illuminate\Database\Eloquent\Model;

class UnitImage extends Model
{
    use HasImageAttributes;

    protected $fillable = ['unit_id', 'path', 'alt_text', 'sort_order', 'is_primary'];

    protected $appends = ['url', 'thumb_url', 'medium_url', 'large_url', 'srcset'];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
        ];
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
