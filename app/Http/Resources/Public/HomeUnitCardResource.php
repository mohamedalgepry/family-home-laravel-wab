<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeUnitCardResource extends JsonResource
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
            'price' => $this->price,
            'area_sqm' => $this->area_sqm,
            'rooms' => $this->rooms,
            'transaction' => $this->transaction,
            'alt_text' => $this->alt_text,
            'area' => $this->whenLoaded('area', fn () => [
                'id' => $this->area->id,
                'name' => $this->area->name,
                'name_ar' => $this->area->name_ar,
                'name_en' => $this->area->name_en,
                'slug' => $this->area->slug,
            ]),
            'type' => $this->whenLoaded('type', fn () => [
                'id' => $this->type->id,
                'name' => $this->type->name,
                'name_ar' => $this->type->name_ar,
                'name_en' => $this->type->name_en,
            ]),
            'finishing_type' => null,
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
