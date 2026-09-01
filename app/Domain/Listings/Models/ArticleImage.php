<?php

namespace App\Domain\Listings\Models;

use App\Domain\Listings\Models\Concerns\HasImageAttributes;
use Illuminate\Database\Eloquent\Model;

class ArticleImage extends Model
{
    use HasImageAttributes;

    protected $fillable = ['article_id', 'path', 'alt_text', 'link_url', 'position', 'size', 'sort_order'];

    protected $appends = ['url', 'thumb_url', 'medium_url', 'large_url', 'srcset'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
