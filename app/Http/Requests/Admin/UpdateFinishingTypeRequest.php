<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFinishingTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        $finishingType = $this->route('finishingType');

        return $this->user()?->can('update', $finishingType) ?? false;
    }

    public function rules(): array
    {
        return [
            'name_ar' => 'required|string|max:100',
            'name_en' => 'required|string|max:100',
        ];
    }
}
