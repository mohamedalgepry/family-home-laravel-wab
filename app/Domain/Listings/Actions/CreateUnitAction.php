<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;

class CreateUnitAction
{
    public function execute(CreateUnitData $data, User $user): Unit
    {
        $sanitized = collect($data->toArray())->map(function ($value, $key) {
            if ($key === 'map_embed_url' && is_string($value) && $value !== '') {
                $src = Sanitizer::extractMapSrc($value) ?? '';

                return Sanitizer::isValidMapEmbed($src) ? $src : '';
            }

            return is_string($value) ? Sanitizer::text($value) : $value;
        })->all();

        $sanitized['name'] = $sanitized['name_en'] ?? '';
        $sanitized['description'] = $sanitized['description_en'] ?? null;

        if ($user->isAgent()) {
            $sanitized['is_active'] = false;
        }

        $features = $sanitized['features'] ?? [];
        unset($sanitized['features']);

        $unit = new Unit;
        $unit->fill($sanitized);
        $unit->user_id = $user->id;
        $unit->is_active = $sanitized['is_active'] ?? true;

        if (! empty($unit->project_id)) {
            $project = \App\Domain\Listings\Models\Project::find($unit->project_id);
            if ($project) {
                if (empty($unit->area_id) && ! empty($project->area_id)) {
                    $unit->area_id = $project->area_id;
                }
                if (empty($unit->location_address_ar) && ! empty($project->location_address_ar)) {
                    $unit->location_address_ar = $project->location_address_ar;
                }
                if (empty($unit->location_address_en) && ! empty($project->location_address_en)) {
                    $unit->location_address_en = $project->location_address_en;
                }
                if (empty($unit->map_embed_url) && ! empty($project->map_embed_url)) {
                    $unit->map_embed_url = $project->map_embed_url;
                }
                if (is_null($unit->latitude) && ! is_null($project->latitude)) {
                    $unit->latitude = $project->latitude;
                }
                if (is_null($unit->longitude) && ! is_null($project->longitude)) {
                    $unit->longitude = $project->longitude;
                }
            }
        }

        $unit->save();

        if (! empty($features)) {
            $unit->features()->sync($features);
        }

        $autoDeleteDays = (int) Setting::getValue('auto_delete_days', '30');
        if ($autoDeleteDays > 0) {
            $unit->update(['auto_delete_at' => now()->addDays($autoDeleteDays)]);
        }

        return $unit;
    }
}
