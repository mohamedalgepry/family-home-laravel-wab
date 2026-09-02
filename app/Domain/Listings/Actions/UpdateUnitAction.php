<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;

class UpdateUnitAction
{
    public function execute(int $unitId, CreateUnitData $data, User $user): Unit
    {
        $unit = Unit::findOrFail($unitId);

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
            unset($sanitized['is_active']);
        }

        $features = $sanitized['features'] ?? [];
        unset($sanitized['features']);

        if (array_key_exists('user_id', $sanitized) && is_null($sanitized['user_id'])) {
            unset($sanitized['user_id']);
        }

        $unit->fill($sanitized);

        if (array_key_exists('is_active', $sanitized)) {
            $unit->is_active = $sanitized['is_active'];
        }

        if (array_key_exists('user_id', $sanitized)) {
            $unit->user_id = $sanitized['user_id'];
        }

        $unit->save();

        if (isset($data->features)) {
            $unit->features()->sync($features);
        }

        return $unit->fresh();
    }
}
