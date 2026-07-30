<?php

namespace App\Http\Requests\Admin;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\Models\Project;
use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Project::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'manager_id' => 'nullable|integer|exists:users,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'area_id' => 'nullable|exists:areas,id',
            'alt_text' => 'nullable|string|max:255',
            'meta_description_ar' => 'nullable|string|max:500',
            'meta_description_en' => 'nullable|string|max:500',
            'keywords_ar' => 'nullable|array',
            'keywords_ar.*' => 'string|max:100',
            'keywords_en' => 'nullable|array',
            'keywords_en.*' => 'string|max:100',
            'video_url' => 'nullable|url|max:500',
            'map_embed_url' => [
                'nullable',
                'string',
                'max:2000',
                function ($attribute, $value, $fail) {
                    if (! empty($value) && ! Sanitizer::isValidMapEmbed($value)) {
                        $fail(__('messages.map_embed_invalid'));
                    }
                },
            ],
            'location_address_ar' => 'nullable|string|max:500',
            'location_address_en' => 'nullable|string|max:500',
            'images' => 'nullable|array|max:20',
            'images.*' => 'file|image|mimes:jpg,jpeg,png,webp|max:5120',
            'payment_method' => 'nullable|in:cash,installment,both',
            'down_payment' => 'nullable|string|max:255',
            'installment_years' => 'nullable|integer|min:0',
            'finishing_type_id' => 'nullable|exists:finishing_types,id',
            'features' => 'nullable|array',
            'features.*' => 'exists:features,id',
        ];
    }
}
