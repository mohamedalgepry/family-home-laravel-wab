<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaNearbyPlace extends Model
{
    protected $fillable = [
        'area_id',
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'distance',
        'distance_unit',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
}
