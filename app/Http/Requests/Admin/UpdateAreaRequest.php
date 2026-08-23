<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Traits\ExtractsCoordinatesFromUrl;
use App\Rules\AllowedIconName;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAreaRequest extends FormRequest
{
    use ExtractsCoordinatesFromUrl;

    public function authorize(): bool
    {
        $area = $this->route('area');

        return $this->user()?->can('update', $area) ?? false;
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

        if ($this->has('features') && is_array($this->input('features'))) {
            $filteredFeatures = [];
            foreach ($this->input('features') as $f) {
                if (! is_array($f)) {
                    continue;
                }
                $titleAr = trim($f['title_ar'] ?? '');
                $titleEn = trim($f['title_en'] ?? '');
                $descAr = trim($f['description_ar'] ?? '');
                $descEn = trim($f['description_en'] ?? '');
                if ($titleAr === '' && $titleEn === '' && $descAr === '' && $descEn === '') {
                    continue;
                }
                $f['title_ar'] = $titleAr !== '' ? $titleAr : ($titleEn !== '' ? $titleEn : 'ميزة');
                $f['title_en'] = $titleEn !== '' ? $titleEn : $f['title_ar'];
                $filteredFeatures[] = $f;
            }
            $merges['features'] = $filteredFeatures;
        }

        if ($this->has('nearby_places') && is_array($this->input('nearby_places'))) {
            $filteredPlaces = [];
            foreach ($this->input('nearby_places') as $p) {
                if (! is_array($p)) {
                    continue;
                }
                $nameAr = trim($p['name_ar'] ?? '');
                $nameEn = trim($p['name_en'] ?? '');
                $descAr = trim($p['description_ar'] ?? '');
                if ($nameAr === '' && $nameEn === '' && $descAr === '') {
                    continue;
                }
                $p['name_ar'] = $nameAr !== '' ? $nameAr : ($nameEn !== '' ? $nameEn : 'مكان قريب');
                $p['name_en'] = $nameEn !== '' ? $nameEn : $p['name_ar'];
                $filteredPlaces[] = $p;
            }
            $merges['nearby_places'] = $filteredPlaces;
        }

        if ($this->has('faqs') && is_array($this->input('faqs'))) {
            $filteredFaqs = [];
            foreach ($this->input('faqs') as $faq) {
                if (! is_array($faq)) {
                    continue;
                }
                $qAr = trim($faq['question_ar'] ?? '');
                $qEn = trim($faq['question_en'] ?? '');
                $aAr = trim($faq['answer_ar'] ?? '');
                if ($qAr === '' && $qEn === '' && $aAr === '') {
                    continue;
                }
                $faq['question_ar'] = $qAr !== '' ? $qAr : ($qEn !== '' ? $qEn : 'سؤال');
                $faq['question_en'] = $qEn !== '' ? $qEn : $faq['question_ar'];
                $filteredFaqs[] = $faq;
            }
            $merges['faqs'] = $filteredFaqs;
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
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20480|dimensions:max_width=6000,max_height=6000',
            'hero_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:20480|dimensions:max_width=6000,max_height=6000',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,webp|max:20480|dimensions:max_width=6000,max_height=6000',

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
            'features.*.id' => 'nullable|exists:area_features,id',
            'features.*.title_ar' => 'nullable|string|max:255',
            'features.*.title_en' => 'nullable|string|max:255',
            'features.*.description_ar' => 'nullable|string',
            'features.*.description_en' => 'nullable|string',
            'features.*.icon' => 'nullable|string|max:100',
            'features.*.sort_order' => 'nullable|integer',
            'features.*.is_active' => 'nullable|boolean',

            'nearby_places' => 'nullable|array',
            'nearby_places.*.id' => 'nullable|exists:area_nearby_places,id',
            'nearby_places.*.name_ar' => 'nullable|string|max:255',
            'nearby_places.*.name_en' => 'nullable|string|max:255',
            'nearby_places.*.description_ar' => 'nullable|string',
            'nearby_places.*.description_en' => 'nullable|string',
            'nearby_places.*.distance' => 'nullable|string|max:100',
            'nearby_places.*.distance_unit' => 'nullable|string|max:100',
            'nearby_places.*.icon' => 'nullable|string|max:100',
            'nearby_places.*.sort_order' => 'nullable|integer',
            'nearby_places.*.is_active' => 'nullable|boolean',

            'faqs' => 'nullable|array',
            'faqs.*.id' => 'nullable|exists:area_faqs,id',
            'faqs.*.question_ar' => 'nullable|string',
            'faqs.*.question_en' => 'nullable|string',
            'faqs.*.answer_ar' => 'nullable|string',
            'faqs.*.answer_en' => 'nullable|string',
            'faqs.*.sort_order' => 'nullable|integer',
            'faqs.*.is_active' => 'nullable|boolean',
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
