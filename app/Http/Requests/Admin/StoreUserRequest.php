<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() || $this->user()?->isManager();
    }

    public function rules(): array
    {
        $isManager = $this->user()?->isManager();

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => [$isManager ? 'nullable' : 'required', 'string', Rule::in(['admin', 'manager', 'agent'])],
            'manager_id' => [
                'nullable',
                Rule::requiredIf(fn () => ! $isManager && $this->role === 'agent'),
                'exists:users,id',
            ],
        ];
    }
}
