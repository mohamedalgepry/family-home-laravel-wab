<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Feature;
use App\Rules\AllowedIconName;
use Illuminate\Foundation\Http\FormRequest;

class StoreFeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Feature::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name_ar' => 'required|string|max:100',
            'name_en' => 'required|string|max:100',
            'icon' => ['nullable', 'string', 'max:50', new AllowedIconName],
        ];
    }
}
