<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Project;

class UpdateProjectRequest extends ProjectFormRequest
{
    public function authorize(): bool
    {
        $project = $this->route('project');

        return $project instanceof Project
            && ($this->user()?->can('update', $project) ?? false);
    }

    protected function extraRules(): array
    {
        return [
            'deleted_image_ids' => 'nullable|array',
            'deleted_image_ids.*' => 'integer|exists:project_images,id',
            'image_order' => 'nullable|array',
            'image_order.*' => 'integer|exists:project_images,id',
        ];
    }
}
