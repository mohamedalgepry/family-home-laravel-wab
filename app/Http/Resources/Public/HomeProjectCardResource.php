<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeProjectCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $image = $this->images->firstWhere('is_primary', true) ?? $this->images->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'slug_ar' => $this->slug_ar,
            'slug_en' => $this->slug_en,
            'alt_text' => $this->alt_text,
            'units_count' => $this->units_count,
            'installment_years' => $this->installment_years,
            'area' => $this->whenLoaded('area', fn () => [
                'id' => $this->area->id,
                'name' => $this->area->name,
                'name_ar' => $this->area->name_ar,
                'name_en' => $this->area->name_en,
                'slug' => $this->area->slug,
            ]),
            'images' => $image ? [[
                'id' => $image->id,
                'path' => $image->path,
                'url' => $image->url,
                'thumb_url' => $image->thumb_url,
                'medium_url' => $image->medium_url,
                'srcset' => $image->srcset,
                'is_primary' => $image->is_primary,
                'alt_text' => $image->alt_text,
            ]] : [],
        ];
    }
}
