<?php

namespace App\Domain\Listings\Models;

use App\Domain\Listings\Models\Concerns\HasImageAttributes;
use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    use HasImageAttributes;

    protected $fillable = ['project_id', 'path', 'alt_text', 'sort_order'];

    protected $appends = ['url', 'thumb_url'];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
