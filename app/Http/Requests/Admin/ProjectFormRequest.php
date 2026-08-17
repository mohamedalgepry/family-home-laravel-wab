<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\HasMapEmbedRule;
use App\Http\Requests\Traits\ExtractsCoordinatesFromUrl;
use Illuminate\Foundation\Http\FormRequest;

abstract class ProjectFormRequest extends FormRequest
{
    use ExtractsCoordinatesFromUrl, HasMapEmbedRule;

    protected function prepareForValidation(): void
    {
        $this->prepareCoordinatesFromMapUrl();
    }

    public function rules(): array
    {
        return array_merge($this->baseRules(), $this->extraRules());
    }

    protected function baseRules(): array
    {
        return [
            'user_id' => 'nullable|integer|exists:users,id',
            'manager_id' => 'nullable|integer|exists:users,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string|max:50000',
            'description_en' => 'nullable|string|max:50000',
            'area_id' => 'nullable|exists:areas,id',
            'alt_text' => 'nullable|string|max:255',
            'meta_description_ar' => 'nullable|string|max:500',
            'meta_description_en' => 'nullable|string|max:500',
            'keywords_ar' => 'nullable|array|max:25',
            'keywords_ar.*' => 'string|max:100',
            'keywords_en' => 'nullable|array|max:25',
            'keywords_en.*' => 'string|max:100',
            'video_url' => 'nullable|url|max:500',
            'map_embed_url' => 'nullable|url|max:1000',
            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],
            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
                function ($attribute, $value, $fail) {
                    if ((float) request('latitude') === 0.0 && (float) $value === 0.0) {
                        $fail(__('validation.custom.coordinates.not_zero'));
                    }
                },
            ],
            'location_address_ar' => 'nullable|string|max:500',
            'location_address_en' => 'nullable|string|max:500',
            'images' => 'nullable|array|max:20',
            'images.*' => 'file|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:max_width=6000,max_height=6000',
            'payment_method' => 'nullable|in:cash,installment,both',
            'down_payment' => 'nullable|string|max:255',
            'installment_years' => 'nullable|integer|min:0',
            'finishing_type_id' => 'nullable|exists:finishing_types,id',
            'features' => 'nullable|array',
            'features.*' => 'exists:features,id',
        ];
    }

    protected function extraRules(): array
    {
        return [];
    }
}
