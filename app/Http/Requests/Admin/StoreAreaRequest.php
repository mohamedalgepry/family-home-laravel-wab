<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Area;
use App\Http\Requests\Traits\ExtractsCoordinatesFromUrl;
use App\Rules\AllowedIconName;
use Illuminate\Foundation\Http\FormRequest;

class StoreAreaRequest extends FormRequest
{
    use ExtractsCoordinatesFromUrl;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Area::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->prepareCoordinatesFromMapUrl();

        $merges = [];

        if ($this->has('parent_id') && ($this->input('parent_id') === '' || $this->input('parent_id') === null)) {
            $merges['parent_id'] = null;
        }

        if ($this->has('latitude') && $this->input('latitude') === '') {
            $merges['latitude'] = null;
        }

        if ($this->has('longitude') && $this->input('longitude') === '') {
            $merges['longitude'] = null;
        }

        if ($this->has('sort_order') && $this->input('sort_order') === '') {
            $merges['sort_order'] = 0;
        }

        if (! empty($merges)) {
            $this->merge($merges);
        }

        if ($this->has('image_path') && ! $this->hasFile('image_path') && $this->input('image_path') !== null) {
            $this->request->remove('image_path');
        }

        if ($this->has('hero_image') && ! $this->hasFile('hero_image') && $this->input('hero_image') !== null) {
            $this->request->remove('hero_image');
        }

        if ($this->has('gallery') && ! $this->hasFile('gallery')) {
            $this->request->remove('gallery');
        }
    }

    public function rules(): array
    {
        return [
            'name_ar' => 'required|string|max:100',
            'name_en' => 'required|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'parent_id' => 'nullable|exists:areas,id',

            'short_description_ar' => 'nullable|string',
            'short_description_en' => 'nullable|string',
            'hero_title_ar' => 'nullable|string|max:255',
            'hero_title_en' => 'nullable|string|max:255',
            'hero_description_ar' => 'nullable|string',
            'hero_description_en' => 'nullable|string',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240|dimensions:max_width=6000,max_height=6000',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240|dimensions:max_width=6000,max_height=6000',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,webp|max:10240|dimensions:max_width=6000,max_height=6000',

            'about_ar' => 'nullable|string',
            'about_en' => 'nullable|string',

            'address_ar' => 'nullable|string|max:255',
            'address_en' => 'nullable|string|max:255',
            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],
            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
                // P1-7: Reject exactly 0,0 as it's null island / unset
                function ($attribute, $value, $fail) {
                    if ((float) request('latitude') === 0.0 && (float) $value === 0.0) {
                        $fail(__('validation.custom.coordinates.not_zero'));
                    }
                },
            ],
            'map_url' => 'nullable|url',

            'meta_title_ar' => 'nullable|string|max:255',
            'meta_title_en' => 'nullable|string|max:255',
            'meta_description_ar' => 'nullable|string|max:500',
            'meta_description_en' => 'nullable|string|max:500',
            'meta_keywords_ar' => 'nullable|array|max:25',
            'meta_keywords_ar.*' => 'string|max:100',
            'meta_keywords_en' => 'nullable|array|max:25',
            'meta_keywords_en.*' => 'string|max:100',

            'features' => 'nullable|array',
            'features.*.title_ar' => 'required_with:features|string|max:255',
            'features.*.title_en' => 'nullable|string|max:255',
            'features.*.description_ar' => 'nullable|string',
            'features.*.description_en' => 'nullable|string',
            'features.*.icon' => ['nullable', 'string', 'max:50', new AllowedIconName],
            'features.*.sort_order' => 'nullable|integer',
            'features.*.is_active' => 'boolean',

            'nearby_places' => 'nullable|array',
            'nearby_places.*.name_ar' => 'required_with:nearby_places|string|max:255',
            'nearby_places.*.name_en' => 'nullable|string|max:255',
            'nearby_places.*.description_ar' => 'nullable|string',
            'nearby_places.*.description_en' => 'nullable|string',
            'nearby_places.*.distance' => 'nullable|string|max:100',
            'nearby_places.*.distance_unit' => 'nullable|string|max:100',
            'nearby_places.*.icon' => ['nullable', 'string', 'max:50', new AllowedIconName],
            'nearby_places.*.sort_order' => 'nullable|integer',
            'nearby_places.*.is_active' => 'boolean',

            'faqs' => 'nullable|array',
            'faqs.*.question_ar' => 'required_with:faqs|string',
            'faqs.*.question_en' => 'nullable|string',
            'faqs.*.answer_ar' => 'nullable|string',
            'faqs.*.answer_en' => 'nullable|string',
            'faqs.*.sort_order' => 'nullable|integer',
            'faqs.*.is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'image_path.max' => 'حجم الصورة يجب ألا يتجاوز 20 ميجابايت.',
            'image_path.image' => 'الملف المرفوع يجب أن يكون صورة صالحة.',
            'image_path.mimes' => 'صيغة الصورة يجب أن تكون: JPG, JPEG, PNG, أو WebP.',
            'features.*.title_ar.required_with' => 'حقل عنوان الميزة (عربي) مطلوب.',
            'nearby_places.*.name_ar.required_with' => 'حقل اسم المكان القريب (عربي) مطلوب.',
            'faqs.*.question_ar.required_with' => 'حقل السؤال (عربي) مطلوب.',
        ];
    }
}
