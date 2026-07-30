<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUnitTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        $unitType = $this->route('unitType');

        return $this->user()?->can('update', $unitType) ?? false;
    }

    public function rules(): array
    {
        return [
            'name_ar' => 'required|string|max:100',
            'name_en' => 'required|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ];
    }
}
