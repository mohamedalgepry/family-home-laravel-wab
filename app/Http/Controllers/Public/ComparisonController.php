<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Services\SeoService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ComparisonController
{
    public function index(): Response|JsonResponse
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
                    ->get()
                    ->map(fn (Unit $unit) => $this->presentUnit($unit))
                    ->values();
            } elseif ($type === 'project') {
                $items = Project::whereIn('id', $idList)
                    ->active()
                    ->with(['area', 'images', 'features', 'finishingType'])
                    ->withCount('units')
                    ->get()
                    ->map(fn (Project $project) => $this->presentProject($project))
                    ->values();
            }
        }

        if (request()->wantsJson()) {
            return response()->json([
                'items' => $items,
                'type' => $type,
                'max_items' => 4,
            ]);
        }

        $meta = app(SeoService::class)->forPage('comparison');

        return Inertia::render('Public/Comparison', [
            'items' => $items,
            'type' => $type,
            'max_items' => 4,
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta]);
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

    /**
     * Whitelist the unit fields exposed on the public comparison page.
     * Prevents leaking internal columns (user_id, priority_points, is_pinned, auto_delete_at, ...).
     *
     * @return array<string, mixed>
     */
    private function presentUnit(Unit $unit): array
    {
        return [
            'id' => $unit->id,
            'name' => $unit->name,
            'slug' => $unit->slug,
            'description' => $unit->description,
            'price' => $unit->price,
            'area_sqm' => $unit->area_sqm,
            'rooms' => $unit->rooms,
            'bathrooms' => $unit->bathrooms,
            'floor' => $unit->floor,
            'transaction' => $unit->transaction,
            'payment_method' => $unit->payment_method,
            'down_payment' => $unit->down_payment,
            'installment_years' => $unit->installment_years,
            'location_address' => $unit->location_address,
            'type' => $unit->type ? ['id' => $unit->type->id, 'name' => $unit->type->name] : null,
            'area' => $unit->area ? ['id' => $unit->area->id, 'name' => $unit->area->name] : null,
            'finishing_type' => $unit->finishingType ? ['id' => $unit->finishingType->id, 'name' => $unit->finishingType->name] : null,
            'project' => $unit->project ? ['id' => $unit->project->id, 'name' => $unit->project->name, 'slug' => $unit->project->slug] : null,
            'features' => $unit->features->map(fn ($f) => ['id' => $f->id, 'name' => $f->name])->values(),
            'images' => $unit->images->map(fn ($img) => [
                'id' => $img->id,
                'path' => $img->path,
                'url' => $img->url,
                'alt_text' => $img->alt_text,
            ])->values(),
        ];
    }

    /**
     * Whitelist the project fields exposed on the public comparison page.
     *
     * @return array<string, mixed>
     */
    private function presentProject(Project $project): array
    {
        return [
            'id' => $project->id,
            'name' => $project->name,
            'slug' => $project->slug,
            'description' => $project->description,
            'location_address' => $project->location_address,
            'payment_method' => $project->payment_method,
            'down_payment' => $project->down_payment,
            'installment_years' => $project->installment_years,
            'units_count' => $project->units_count,
            'area' => $project->area ? ['id' => $project->area->id, 'name' => $project->area->name] : null,
            'finishing_type' => $project->finishingType ? ['id' => $project->finishingType->id, 'name' => $project->finishingType->name] : null,
            'features' => $project->features->map(fn ($f) => ['id' => $f->id, 'name' => $f->name])->values(),
            'images' => $project->images->map(fn ($img) => [
                'id' => $img->id,
                'path' => $img->path,
                'url' => $img->url,
                'alt_text' => $img->alt_text,
            ])->values(),
        ];
    }
}
