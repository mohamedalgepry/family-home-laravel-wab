<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Actions\StoreUploadedImagesAction;
use App\Domain\Listings\Actions\UnitFormDataAction;
use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitImage;
use App\Domain\Listings\Services\UnitService;
use App\Domain\Points\Actions\AdjustUnitPointsAction;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdjustPointsRequest;
use App\Http\Requests\Admin\StoreUnitRequest;
use App\Http\Requests\Admin\UpdateUnitRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function __construct(
        private readonly UnitService $unitService,
        private readonly StoreUploadedImagesAction $storeUploadedImagesAction,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Unit::class);

        $filters = $request->only(['search', 'area_id', 'type_id', 'sort', 'direction', 'per_page']);

        return Inertia::render('Admin/Units/Index', $this->unitService->getAdminIndexData($filters, $request->user()) + [
            'filters' => $filters,
        ]);
    }

    public function create(UnitFormDataAction $formDataAction): Response
    {
        $this->authorize('create', Unit::class);

        $formData = $formDataAction->execute(request()->user());
        $formData['unit'] = null;

        return Inertia::render('Admin/Units/Form', $formData);
    }

    public function edit(Unit $unit, UnitFormDataAction $formDataAction): Response
    {
        $this->authorize('update', $unit);

        $unit->load(['type', 'area', 'images', 'features']);

        $formData = $formDataAction->execute(request()->user());
        $formData['unit'] = $unit;

        return Inertia::render('Admin/Units/Form', $formData);
    }

    public function store(StoreUnitRequest $request): RedirectResponse
    {
        $this->authorize('create', Unit::class);

        $validated = $request->validated();
        $targetUser = $request->user();
        if ($request->user()->isAdmin() && ! empty($validated['user_id'])) {
            $targetUser = User::find($validated['user_id']) ?? $request->user();
        }
        $validated['user_id'] = $targetUser->id;

        $data = CreateUnitData::from($validated);
        $primaryImageIndex = (int) $request->input('primary_image_index', 0);
        $imagePaths = $this->storeUploadedImagesAction->execute($request->file('images', []), 'units');

        $this->unitService->createUnit(
            data: $data,
            user: $targetUser,
            imagePaths: $imagePaths,
            primaryImageIndex: $primaryImageIndex,
        );

        return redirect()->route('admin.units.index')
            ->with('success', __('common.added_successfully'));
    }

    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        $this->authorize('update', $unit);

        $validated = $request->validated();
        if (! $request->user()->isAdmin()) {
            unset($validated['user_id']);
        }

        $data = CreateUnitData::from($validated);
        $primaryImageIndex = (int) $request->input('primary_image_index', 0);
        $newImagePaths = $this->storeUploadedImagesAction->execute($request->file('images', []), 'units');

        $updatedUnit = $this->unitService->updateUnit(
            unitId: $unit->id,
            data: $data,
            user: $request->user(),
            newImagePaths: $newImagePaths,
            primaryImageIndex: $primaryImageIndex,
        );

        if ($request->user()->isAdmin() && ! empty($validated['user_id'])) {
            $updatedUnit->user_id = (int) $validated['user_id'];
            $updatedUnit->save();
        }

        return redirect()->route('admin.units.index')
            ->with('success', __('common.updated_successfully'));
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $this->authorize('delete', $unit);

        $this->unitService->deleteUnit($unit->id);

        return redirect()->route('admin.units.index')
            ->with('success', __('common.deleted_successfully'));
    }

    public function removeImage(Unit $unit, UnitImage $image): RedirectResponse
    {
        $this->authorize('update', $unit);
        abort_unless((int) $image->unit_id === (int) $unit->id, 403);

        $this->unitService->removeImage($unit->id, $image->id);

        return back()->with('success', __('common.deleted_successfully'));
    }

    public function setPrimaryImage(Unit $unit, UnitImage $image): RedirectResponse
    {
        $this->authorize('update', $unit);
        abort_unless((int) $image->unit_id === (int) $unit->id, 403);

        $this->unitService->setPrimaryImage($unit->id, $image->id);

        return back()->with('success', __('common.updated_successfully'));
    }

    public function togglePin(Unit $unit, Request $request)
    {
        $this->authorize('togglePin', $unit);

        return $this->respondWithFlag($request, $this->unitService->togglePin($unit->id), 'is_pinned', __('admin.pin_success'));
    }

    public function toggleDeal(Unit $unit, Request $request)
    {
        $this->authorize('toggleDeal', $unit);

        return $this->respondWithFlag($request, $this->unitService->toggleDeal($unit->id), 'is_deal', __('admin.deal_success'));
    }

    public function toggleActive(Unit $unit, Request $request)
    {
        $this->authorize('toggleActive', $unit);

        return $this->respondWithFlag($request, $this->unitService->toggleActive($unit->id, $request->user()), 'is_active', __('admin.activation_success'));
    }

    public function adjustPoints(Unit $unit, AdjustPointsRequest $request, AdjustUnitPointsAction $action)
    {
        $action->execute($unit, (int) $request->input('points'), $request->user());

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'priority_points' => (int) $request->input('points'),
                'message' => __('admin.points_adjusted_successfully'),
            ]);
        }

        return redirect()->back()
            ->with('success', __('admin.points_adjusted_successfully'));
    }

    /**
     * Shared JSON/redirect response for boolean flag toggles.
     */
    private function respondWithFlag(Request $request, object $updated, string $flag, string $message)
    {
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                $flag => (bool) $updated->{$flag},
                'message' => $message,
            ]);
        }

        return redirect()->back()->with('success', $message);
    }
}
