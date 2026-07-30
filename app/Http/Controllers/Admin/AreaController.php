<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Area;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAreaRequest;
use App\Http\Requests\Admin\UpdateAreaRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AreaController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Area::class);

        return Inertia::render('Admin/Areas/Index', [
            'areas' => Area::sorted()->get(),
        ]);
    }

    public function store(StoreAreaRequest $request): RedirectResponse
    {
        $this->authorize('create', Area::class);

        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['name_en']);

        Area::create($validated);

        return redirect()->back()->with('success', __('common.added_successfully'));
    }

    public function update(UpdateAreaRequest $request, Area $area): RedirectResponse
    {
        $this->authorize('update', $area);

        $validated = $request->validated();

        if ($area->name_en !== $validated['name_en']) {
            $validated['slug'] = Str::slug($validated['name_en']);
        }

        $area->update($validated);

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function destroy(Area $area): RedirectResponse
    {
        $this->authorize('delete', Area::class);

        $area->delete();

        return redirect()->back()->with('success', __('common.deleted_successfully'));
    }
}
