<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAreaRequest extends FormRequest
{
    public function authorize(): bool
    {
        $area = $this->route('area');

        return $this->user()?->can('update', $area) ?? false;
    }

    public function rules(): array
    {
        return [
            'name_ar' => 'required|string|max:100',
            'name_en' => 'required|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'meta_title_ar' => 'nullable|string|max:255',
            'meta_title_en' => 'nullable|string|max:255',
            'meta_description_ar' => 'nullable|string',
            'meta_description_en' => 'nullable|string',
            'meta_keywords_ar' => 'nullable|array',
            'meta_keywords_ar.*' => 'string|max:100',
            'meta_keywords_en' => 'nullable|array',
            'meta_keywords_en.*' => 'string|max:100',
            'image_path' => 'nullable|string|max:255',
        ];
    }
}
