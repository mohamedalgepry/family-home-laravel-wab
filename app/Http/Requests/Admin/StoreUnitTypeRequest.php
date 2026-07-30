<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\UnitType;
use Illuminate\Foundation\Http\FormRequest;

class StoreUnitTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', UnitType::class) ?? false;
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
