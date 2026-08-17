<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdjustPointsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('allocate-points', $this->route('unit')) ?? false;
    }

    public function rules(): array
    {
        return [
            'points' => ['required', 'integer', 'min:0'],
        ];
    }
}
