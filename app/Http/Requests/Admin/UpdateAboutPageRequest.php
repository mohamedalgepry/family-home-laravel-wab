<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'content_ar' => 'nullable|string',
            'content_en' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'file|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:max_width=6000,max_height=6000',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'string',
        ];
    }
}
