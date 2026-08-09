<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class ComparisonController
{
    public function index(): Response
    {
        $type = request('type', 'unit');
        $ids = request('ids', '');

        $idList = array_filter(array_map('intval', explode(',', $ids)));
        $idList = array_slice($idList, 0, 4);

        $items = [];

        if (! empty($idList)) {
            if ($type === 'unit') {
                $items = Unit::whereIn('id', $idList)
                    ->active()
                    ->with(['type', 'area', 'images', 'features', 'finishingType', 'project'])
                    ->get();
            } elseif ($type === 'project') {
                $items = Project::whereIn('id', $idList)
                    ->active()
                    ->with(['area', 'images', 'features', 'finishingType'])
                    ->get();
            }
        }

        if (request()->wantsJson()) {
            return response()->json([
                'items' => $items,
                'type' => $type,
                'max_items' => 4,
            ]);
        }

        return Inertia::render('Public/Comparison', [
            'items' => $items,
            'type' => $type,
            'max_items' => 4,
        ])->withViewData(['meta' => app(SeoService::class)->forPage('comparison')]);
    }

    public function search()
    {
        $type = request('type', 'unit');
        $q = request('q', '');

        if (empty($q) || mb_strlen($q) < 2) {
            return response()->json([]);
        }

        $searchTerm = $q;

        if ($type === 'unit') {
            $items = Unit::where(function ($query) use ($searchTerm) {
                $query->where('name_ar', 'like', "%{$searchTerm}%")
                    ->orWhere('name_en', 'like', "%{$searchTerm}%");
            })
                ->active()
                ->select('id', 'name_ar', 'name_en', 'price', 'area_sqm', 'rooms')
                ->limit(10)
                ->get()
                ->map(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'price' => $u->price,
                    'area_sqm' => $u->area_sqm,
                    'rooms' => $u->rooms,
                ]);
        } else {
            $items = Project::where(function ($query) use ($searchTerm) {
                $query->where('name_ar', 'like', "%{$searchTerm}%")
                    ->orWhere('name_en', 'like', "%{$searchTerm}%");
            })
                ->active()
                ->select('id', 'name_ar', 'name_en')
                ->limit(10)
                ->get()
                ->map(fn ($p) => ['id' => $p->id, 'name' => $p->name]);
        }

        return response()->json($items);
    }
}
