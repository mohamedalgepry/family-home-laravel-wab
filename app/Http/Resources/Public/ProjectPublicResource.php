<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectPublicResource extends JsonResource
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
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'slug' => $this->slug,
            'slug_ar' => $this->slug_ar,
            'slug_en' => $this->slug_en,
            'description' => $this->description,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'alt_text' => $this->alt_text,
            'is_active' => $this->is_active,
            'units_count' => $this->units_count,
            'location_address' => $this->location_address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'map_embed_url' => $this->map_embed_url,
            'video_url' => $this->video_url,
            'video_path' => $this->video_path ? asset('storage/' . $this->video_path) : null,
            'payment_method' => $this->payment_method,
            'down_payment' => $this->down_payment,
            'installment_years' => $this->installment_years,
            'delivery_date' => $this->delivery_date,
            'meta_description' => $this->meta_description,

            // Relations
            'area' => $this->whenLoaded('area', function () {
                return [
                    'id' => $this->area->id,
                    'name' => $this->area->name,
                    'name_ar' => $this->area->name_ar,
                    'name_en' => $this->area->name_en,
                    'slug' => $this->area->slug,
                ];
            }),
            'features' => $this->whenLoaded('features', function () {
                return $this->features->map(function ($feature) {
                    return [
                        'id' => $feature->id,
                        'name' => $feature->name,
                        'name_ar' => $feature->name_ar,
                        'name_en' => $feature->name_en,
                        'icon' => $feature->icon,
                    ];
                });
            }),
            'finishingType' => $this->whenLoaded('finishingType', function () {
                return [
                    'id' => $this->finishingType->id,
                    'name' => $this->finishingType->name,
                    'name_ar' => $this->finishingType->name_ar,
                    'name_en' => $this->finishingType->name_en,
                ];
            }),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'path' => $image->path,
                        'url' => asset('storage/' . $image->path),
                        'thumb_url' => $image->thumb_path ? asset('storage/' . $image->thumb_path) : null,
                        'is_main' => $image->is_main,
                        'is_primary' => $image->is_primary,
                        'alt_text' => $image->alt_text,
                    ];
                });
            }),
            'units' => $this->whenLoaded('units', function () {
                return UnitPublicResource::collection($this->units);
            }),
            'user' => $this->whenLoaded('user', function () {
                return AgentPublicResource::make($this->user);
            }),
        ];
    }
}
