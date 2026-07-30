<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AssignAgentsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'manager_id' => 'required|exists:users,id',
            'agent_ids' => 'array',
            'agent_ids.*' => 'exists:users,id',
        ];
    }
}
