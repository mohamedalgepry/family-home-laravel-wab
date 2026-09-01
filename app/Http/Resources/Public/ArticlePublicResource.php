<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticlePublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'slug_ar' => $this->slug_ar,
            'slug_en' => $this->slug_en,
            'content' => $this->content,
            'content_ar' => $this->content_ar,
            'content_en' => $this->content_en,
            'meta_description' => $this->meta_description,
            'meta_description_ar' => $this->meta_description_ar,
            'meta_description_en' => $this->meta_description_en,
            'keywords' => $this->keywords,
            'keywords_ar' => $this->keywords_ar,
            'keywords_en' => $this->keywords_en,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Relations
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name_ar' => $this->category->name_ar,
                    'name_en' => $this->category->name_en,
                    'slug' => $this->category->slug,
                ];
            }),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'path' => $image->path,
                        'url' => $image->url,
                        'thumb_url' => $image->thumb_url ?: null,
                        'medium_url' => $image->medium_url ?: null,
                        'large_url' => $image->large_url ?: null,
                        'srcset' => $image->srcset,
                        'is_primary' => $image->is_primary ?? false,
                        'position' => $image->position ?? 'middle',
                        'link_url' => $image->link_url,
                        'alt_text' => $image->alt_text,
                        'sort_order' => $image->sort_order,
                    ];
                });
            }),
            'user' => $this->whenLoaded('user', function () {
                return AgentPublicResource::make($this->user);
            }),
        ];
    }
}
