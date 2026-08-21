<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Article;
use App\Rules\SafeUrl;
use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Article::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title_ar' => 'required_without:title_en|nullable|string|max:255',
            'title_en' => 'required_without:title_ar|nullable|string|max:255',
            'content_ar' => 'required_without:content_en|nullable|string',
            'content_en' => 'required_without:content_ar|nullable|string',
            'excerpt_ar' => 'nullable|string|max:500',
            'excerpt_en' => 'nullable|string|max:500',
            'alt_text' => 'nullable|string|max:500',
            'alt_text_ar' => 'nullable|string|max:500',
            'alt_text_en' => 'nullable|string|max:500',
            'keywords' => 'nullable|array|max:25',
            'keywords.*' => 'string|max:100',
            'keywords_ar' => 'nullable|array|max:25',
            'keywords_ar.*' => 'string|max:100',
            'keywords_en' => 'nullable|array|max:25',
            'keywords_en.*' => 'string|max:100',
            'meta_description' => 'nullable|string|max:500',
            'meta_description_ar' => 'nullable|string|max:500',
            'meta_description_en' => 'nullable|string|max:500',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:max_width=6000,max_height=6000',
            'images' => 'nullable|array',
            'images.*' => 'file|image|mimes:jpg,jpeg,png,webp|max:5120|dimensions:max_width=6000,max_height=6000',
            'new_image_alts' => 'nullable|array',
            'new_image_alts.*' => 'nullable|string|max:500',
            'new_image_positions' => 'nullable|array',
            'new_image_positions.*' => 'nullable|in:top,middle,bottom',
            'new_image_links' => 'nullable|array',
            'new_image_links.*' => ['nullable', 'string', 'max:2048', new SafeUrl],
        ];
    }
}
