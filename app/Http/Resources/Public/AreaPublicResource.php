<?php

namespace App\Http\Resources\Public;

use App\Support\IconAllowlist;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AreaPublicResource extends JsonResource
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
            'short_description_ar' => $this->short_description_ar,
            'short_description_en' => $this->short_description_en,
            'hero_title_ar' => $this->hero_title_ar,
            'hero_title_en' => $this->hero_title_en,
            'hero_description_ar' => $this->hero_description_ar,
            'hero_description_en' => $this->hero_description_en,
            'about_area_text_ar' => $this->about_area_text_ar,
            'about_area_text_en' => $this->about_area_text_en,
            'address_ar' => $this->address_ar,
            'address_en' => $this->address_en,
            'map_url' => $this->map_url,
            'latitude' => (string) $this->latitude,
            'longitude' => (string) $this->longitude,
            'image_path' => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'hero_image' => $this->hero_image ? asset('storage/' . $this->hero_image) : null,
            'gallery' => $this->gallery ? array_map(fn($path) => asset('storage/' . $path), is_string($this->gallery) ? json_decode($this->gallery, true) : $this->gallery) : [],
            'projects_count' => $this->projects_count,
            'units_count' => $this->units_count,
            'meta_description_ar' => $this->meta_description_ar,
            'meta_description_en' => $this->meta_description_en,
            
            // Relations
            'features' => $this->whenLoaded('features', function () {
                return $this->features->map(function ($feature) {
                    return [
                        'id' => $feature->id,
                        'title_ar' => $feature->title_ar,
                        'title_en' => $feature->title_en,
                        'description_ar' => $feature->description_ar,
                        'description_en' => $feature->description_en,
                        'sort_order' => $feature->sort_order,
                        'is_active' => $feature->is_active,
                        'icon_name' => IconAllowlist::safeName($feature->icon),
                    ];
                });
            }),
            'nearbyPlaces' => $this->whenLoaded('nearbyPlaces', function () {
                return $this->nearbyPlaces->map(function ($place) {
                    return [
                        'id' => $place->id,
                        'name_ar' => $place->name_ar,
                        'name_en' => $place->name_en,
                        'distance' => $place->distance,
                        'distance_unit' => $place->distance_unit,
                        'sort_order' => $place->sort_order,
                        'is_active' => $place->is_active,
                        'icon_name' => IconAllowlist::safeName($place->icon),
                    ];
                });
            }),
            'faqs' => $this->whenLoaded('faqs', function () {
                return $this->faqs->map(function ($faq) {
                    return [
                        'id' => $faq->id,
                        'question_ar' => $faq->question_ar,
                        'question_en' => $faq->question_en,
                        'answer_ar' => $faq->answer_ar,
                        'answer_en' => $faq->answer_en,
                        'is_active' => $faq->is_active,
                    ];
                });
            }),
        ];
    }
}
