<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $headerImage = $this->images?->firstWhere('position', 'header')
            ?? $this->images?->firstWhere('is_primary', true)
            ?? $this->images?->first();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'slug_ar' => $this->slug_ar,
            'slug_en' => $this->slug_en,
            'excerpt' => $this->excerpt,
            'alt_text' => $this->alt_text,
            'published_at' => $this->published_at,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name_ar' => $this->category->name_ar,
                    'name_en' => $this->category->name_en,
                    'slug' => $this->category->slug,
                ];
            }),
            'images' => $headerImage ? [[
                'id' => $headerImage->id,
                'path' => $headerImage->path,
                'url' => $headerImage->url,
                'thumb_url' => $headerImage->thumb_url ?: null,
                'srcset' => $headerImage->srcset,
                'position' => $headerImage->position ?? 'middle',
                'alt_text' => $headerImage->alt_text,
            ]] : [],
        ];
    }
}
