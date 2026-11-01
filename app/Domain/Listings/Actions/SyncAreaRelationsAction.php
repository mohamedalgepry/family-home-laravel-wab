<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Area;
use Illuminate\Http\Request;

/**
 * Syncs the area's has-many editorial relations from the admin form payload.
 */
class SyncAreaRelationsAction
{
    /** Request input key => model relation name. */
    private const RELATIONS = [
        'features' => 'features',
        'nearby_places' => 'nearbyPlaces',
        'faqs' => 'faqs',
    ];

    public function execute(Area $area, Request $request): void
    {
        foreach (self::RELATIONS as $inputKey => $relation) {
            if (! $request->has($inputKey)) {
                continue;
            }

            $this->syncHasMany($area, $relation, $request->input($inputKey) ?: []);
        }
    }

    private function syncHasMany(Area $area, string $relation, array $items): void
    {
        $existingIds = $area->{$relation}()->pluck('id')->toArray();
        $newIds = [];

        foreach ($items as $item) {
            // Never trust timestamps/ids coming from the frontend payload —
            // they arrive as ISO 8601 strings (e.g. 2026-08-15T18:50:50.000000Z)
            // which MySQL's DATETIME columns reject, causing the whole row
            // update to fail silently (caught by the Inertia exception handler).
            $payload = collect($item)->except(['id', 'created_at', 'updated_at', 'area_id'])->toArray();

            if (isset($item['id']) && in_array($item['id'], $existingIds)) {
                $area->{$relation}()->where('id', $item['id'])->update($payload);
                $newIds[] = $item['id'];
            } else {
                $created = $area->{$relation}()->create($payload);
                $newIds[] = $created->id;
            }
        }

        $idsToDelete = array_diff($existingIds, $newIds);
        if (count($idsToDelete) > 0) {
            $area->{$relation}()->whereIn('id', $idsToDelete)->delete();
        }
    }
}
