<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\FinishingType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFinishingTypeRequest;
use App\Http\Requests\Admin\UpdateFinishingTypeRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FinishingTypeController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', FinishingType::class);

        return Inertia::render('Admin/FinishingTypes/Index', [
            'finishingTypes' => FinishingType::latest()->get(),
        ]);
    }

    public function store(StoreFinishingTypeRequest $request): RedirectResponse
    {
        $this->authorize('create', FinishingType::class);
        $validated = $request->validated();

        FinishingType::create($validated);

        return redirect()->back()->with('success', __('common.added_successfully'));
    }

    public function update(UpdateFinishingTypeRequest $request, FinishingType $finishingType): RedirectResponse
    {
        $this->authorize('update', $finishingType);

        $validated = $request->validated();

        $finishingType->update($validated);

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function destroy(FinishingType $finishingType): RedirectResponse
    {
        $this->authorize('delete', $finishingType);

        $finishingType->delete();

        return redirect()->back()->with('success', __('common.deleted_successfully'));
    }
}
