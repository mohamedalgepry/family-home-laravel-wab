<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_ar',
        'name_en',
        'icon',
    ];

    public function projects()
    {
        return $this->belongsToMany(Project::class);
    }

    public function units()
    {
        return $this->belongsToMany(Unit::class);
    }
}
