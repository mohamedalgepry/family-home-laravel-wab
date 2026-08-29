<?php

namespace App\Domain\Assistant\Models;

use Illuminate\Database\Eloquent\Model;

class AssistantLead extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'context',
        'status',
        'chat_history'
    ];

    protected $casts = [
        'chat_history' => 'array'
    ];
}
