<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', Rule::in(['admin', 'manager', 'agent'])],
            'manager_id' => [
                Rule::requiredIf(fn () => $this->input('role') === 'agent'),
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ];
    }
}
