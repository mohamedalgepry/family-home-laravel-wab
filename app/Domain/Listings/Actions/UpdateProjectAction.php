<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateProjectData;
use App\Domain\Listings\Models\Project;

class UpdateProjectAction
{
    public function execute(int $projectId, CreateProjectData $data): Project
    {
        $project = Project::findOrFail($projectId);

        $sanitized = collect($data->toArray())->map(function ($value, $key) {
            if ($key === 'map_embed_url' && is_string($value) && $value !== '') {
                return Sanitizer::extractMapSrc($value) ?? '';
            }

            return is_string($value) ? Sanitizer::text($value) : $value;
        })->all();

        $sanitized['name'] = $sanitized['name_en'] ?? '';
        $sanitized['description'] = $sanitized['description_en'] ?? null;

        $features = $sanitized['features'] ?? [];
        unset($sanitized['features']);

        if (array_key_exists('user_id', $sanitized) && is_null($sanitized['user_id'])) {
            unset($sanitized['user_id']);
        }

        $project->update($sanitized);

        if (isset($data->features)) {
            $project->features()->sync($features);
        }

        return $project->fresh();
    }
}
