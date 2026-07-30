<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\FinishingType;
use Illuminate\Foundation\Http\FormRequest;

class StoreFinishingTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', FinishingType::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name_ar' => 'required|string|max:100',
            'name_en' => 'required|string|max:100',
        ];
    }
}
