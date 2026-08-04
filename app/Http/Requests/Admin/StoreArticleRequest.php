<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Article;
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
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:100',
            'meta_description' => 'nullable|string|max:500',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|file|image|max:5120',
            'images' => 'nullable|array',
            'images.*' => 'file|image|max:5120',
            'new_image_alts' => 'nullable|array',
            'new_image_alts.*' => 'nullable|string|max:500',
            'new_image_positions' => 'nullable|array',
            'new_image_positions.*' => 'nullable|in:top,middle,bottom',
            'new_image_links' => 'nullable|array',
            'new_image_links.*' => 'nullable|string|max:2048',
        ];
    }
}
