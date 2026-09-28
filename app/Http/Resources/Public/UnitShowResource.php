<?php

namespace App\Http\Resources\Public;

use App\Support\IconAllowlist;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitShowResource extends JsonResource
{
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
            'keywords' => $this->keywords,
            'keywords_ar' => $this->keywords_ar,
            'keywords_en' => $this->keywords_en,
            'price' => $this->price,
            'area_sqm' => $this->area_sqm,
            'rooms' => $this->rooms,
            'bathrooms' => $this->bathrooms,
            'floor' => $this->floor,
            'transaction' => $this->transaction,
            'payment_method' => $this->payment_method,
            'down_payment' => $this->down_payment,
            'installment_years' => $this->installment_years,
            'alt_text' => $this->alt_text,
            'location_address' => $this->location_address,
            'location_address_ar' => $this->location_address_ar,
            'location_address_en' => $this->location_address_en,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'map_embed_url' => $this->map_embed_url,
            'video_url' => $this->video_url,
            'video_path' => $this->video_path ? asset('storage/'.$this->video_path) : null,
            'meta_description' => $this->meta_description,
            'is_active' => $this->is_active,
            'is_deal' => $this->is_deal,

            'area' => $this->whenLoaded('area', function () {
                return [
                    'id' => $this->area->id,
                    'name' => $this->area->name,
                    'name_ar' => $this->area->name_ar,
                    'name_en' => $this->area->name_en,
                    'slug' => $this->area->slug,
                ];
            }),

            'type' => $this->whenLoaded('type', function () {
                return [
                    'id' => $this->type->id,
                    'name' => $this->type->name ?: (app()->getLocale() === 'ar' ? $this->type->name_ar : $this->type->name_en),
                    'name_ar' => $this->type->name_ar,
                    'name_en' => $this->type->name_en,
                ];
            }),

            'finishingType' => $this->whenLoaded('finishingType', function () {
                return [
                    'id' => $this->finishingType->id,
                    'name' => $this->finishingType->name ?: (app()->getLocale() === 'ar' ? $this->finishingType->name_ar : $this->finishingType->name_en),
                    'name_ar' => $this->finishingType->name_ar,
                    'name_en' => $this->finishingType->name_en,
                ];
            }),

            'finishing_type' => $this->whenLoaded('finishingType', function () {
                return [
                    'id' => $this->finishingType->id,
                    'name' => $this->finishingType->name ?: (app()->getLocale() === 'ar' ? $this->finishingType->name_ar : $this->finishingType->name_en),
                    'name_ar' => $this->finishingType->name_ar,
                    'name_en' => $this->finishingType->name_en,
                ];
            }),

            'features' => $this->whenLoaded('features', function () {
                return $this->features->map(fn ($feature) => [
                    'id' => $feature->id,
                    'name' => $feature->name,
                    'name_ar' => $feature->name_ar,
                    'name_en' => $feature->name_en,
                    'icon_name' => IconAllowlist::safeName($feature->icon),
                ])->values();
            }),

            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(fn ($image) => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'thumb_url' => $image->thumb_url ?: null,
                    'medium_url' => $image->medium_url ?: null,
                    'large_url' => $image->large_url ?: null,
                    'srcset' => $image->srcset,
                    'is_primary' => $image->is_primary,
                    'alt_text' => $image->alt_text,
                ])->values();
            }),

            'project' => $this->whenLoaded('project', function () {
                if (! $this->project) {
                    return null;
                }

                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                    'slug' => $this->project->slug,
                    'slug_ar' => $this->project->slug_ar,
                    'slug_en' => $this->project->slug_en,
                    'installment_years' => $this->project->installment_years,
                    'area' => $this->project->relationLoaded('area') && $this->project->area ? [
                        'id' => $this->project->area->id,
                        'name' => $this->project->area->name,
                        'name_ar' => $this->project->area->name_ar,
                        'name_en' => $this->project->area->name_en,
                        'slug' => $this->project->area->slug,
                    ] : null,
                ];
            }),

            'user' => $this->whenLoaded('user', function () {
                return AgentPublicResource::make($this->user)->resolve();
            }),
        ];
    }
}
