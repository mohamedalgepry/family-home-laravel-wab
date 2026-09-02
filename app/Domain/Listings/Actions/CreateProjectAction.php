<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateProjectData;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;

class CreateProjectAction
{
    public function execute(CreateProjectData $data, int $userId): Project
    {
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

        $project = Project::create(array_merge(
            $sanitized,
            ['user_id' => $userId],
        ));

        if (! empty($features)) {
            $project->features()->sync($features);
        }

        $autoDeleteDays = (int) Setting::getValue('auto_delete_days', '30');
        if ($autoDeleteDays > 0) {
            $project->update(['auto_delete_at' => now()->addDays($autoDeleteDays)]);
        }

        return $project;
    }
}
