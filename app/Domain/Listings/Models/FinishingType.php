<?php

namespace App\Domain\Listings\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinishingType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_ar',
        'name_en',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }
}
