<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Feature;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFeatureRequest;
use App\Http\Requests\Admin\UpdateFeatureRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeatureController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Feature::class);

        return Inertia::render('Admin/Features/Index', [
            'features' => Feature::latest()->get(),
        ]);
    }

    public function store(StoreFeatureRequest $request): RedirectResponse
    {
        $this->authorize('create', Feature::class);
        $validated = $request->validated();

        Feature::create($validated);

        return redirect()->back()->with('success', __('common.added_successfully'));
    }

    public function update(UpdateFeatureRequest $request, Feature $feature): RedirectResponse
    {
        $this->authorize('update', $feature);

        $validated = $request->validated();

        $feature->update($validated);

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function destroy(Feature $feature): RedirectResponse
    {
        $this->authorize('delete', $feature);

        $feature->delete();

        return redirect()->back()->with('success', __('common.deleted_successfully'));
    }
}
