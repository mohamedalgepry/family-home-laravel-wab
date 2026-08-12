<?php

namespace App\Http\Requests\Admin;

use App\Rules\AllowedIconName;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFeatureRequest extends FormRequest
{
    public function authorize(): bool
    {
        $feature = $this->route('feature');

        return $this->user()?->can('update', $feature) ?? false;
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
