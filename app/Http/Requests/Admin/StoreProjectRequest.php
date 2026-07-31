<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Project;

class StoreProjectRequest extends ProjectFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Project::class) ?? false;
    }

    protected function extraRules(): array
    {
        return [
            'manager_id' => 'nullable|integer|exists:users,id',
        ];
    }
}
