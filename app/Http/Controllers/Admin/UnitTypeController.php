<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\UnitType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUnitTypeRequest;
use App\Http\Requests\Admin\UpdateUnitTypeRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UnitTypeController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', UnitType::class);

        return Inertia::render('Admin/UnitTypes/Index', [
            'unitTypes' => UnitType::sorted()->get(),
        ]);
    }

    public function store(StoreUnitTypeRequest $request): RedirectResponse
    {
        $this->authorize('create', UnitType::class);
        $validated = $request->validated();

        $validated['slug'] = Str::slug($validated['name_en']);

        UnitType::create($validated);

        return redirect()->back()->with('success', __('common.added_successfully'));
    }

    public function update(UpdateUnitTypeRequest $request, UnitType $unitType): RedirectResponse
    {
        $this->authorize('update', $unitType);

        $validated = $request->validated();

        if ($unitType->name_en !== $validated['name_en']) {
            $validated['slug'] = Str::slug($validated['name_en']);
        }

        $unitType->update($validated);

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function destroy(UnitType $unitType): RedirectResponse
    {
        $this->authorize('delete', UnitType::class);

        $unitType->delete();

        return redirect()->back()->with('success', __('common.deleted_successfully'));
    }
}
