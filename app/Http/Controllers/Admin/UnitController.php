<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Common\QueryBuilders\UserScopeQueryBuilder;
use App\Domain\Listings\Actions\StoreUploadedImagesAction;
use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitImage;
use App\Domain\Listings\Models\UnitType;
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

    public function index(): Response
    {
        $this->authorize('viewAny', Unit::class);

        $user = request()->user();
        $filters = request()->only(['search', 'area_id', 'type_id', 'sort', 'direction', 'per_page']);

        $units = $this->unitService->getPaginatedUnits($filters, $user);

        $stats = [
            'total' => Unit::when($user && $user->role === 'agent', fn ($q) => $q->where('user_id', $user->id))->count(),
            'active' => Unit::when($user && $user->role === 'agent', fn ($q) => $q->where('user_id', $user->id))->where('is_active', true)->count(),
            'deals' => Unit::when($user && $user->role === 'agent', fn ($q) => $q->where('user_id', $user->id))->where('is_deal', true)->count(),
            'pinned' => Unit::when($user && $user->role === 'agent', fn ($q) => $q->where('user_id', $user->id))->where('is_pinned', true)->count(),
        ];

        $areas = Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get();
        $unitTypes = UnitType::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get();

        return Inertia::render('Admin/Units/Index', [
            'units' => $units,
            'stats' => $stats,
            'areas' => $areas,
            'unitTypes' => $unitTypes,
            'filters' => $filters,
            'autoDeleteDays' => (int) \App\Domain\Listings\Models\Setting::getValue('auto_delete_days', '30'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Unit::class);

        $formData = $this->getFormData(request()->user());
        $formData['unit'] = null;

        return Inertia::render('Admin/Units/Form', $formData);
    }

    public function edit(Unit $unit): Response
    {
        $this->authorize('update', $unit);

        $unit->load(['type', 'area', 'images', 'features']);

        $formData = $this->getFormData(request()->user());
        $formData['unit'] = $unit;

        return Inertia::render('Admin/Units/Form', $formData);
    }

    private function getFormData($user): array
    {
        $projects = Project::select('id', 'name_ar', 'name_en');

        UserScopeQueryBuilder::applyOwnershipScope($projects, $user);

        return [
            'areas' => Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'unitTypes' => UnitType::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'projects' => $projects->orderBy('name_en')->get(),
            'features' => Feature::select('id', 'name_ar', 'name_en')->get(),
            'finishingTypes' => FinishingType::select('id', 'name_ar', 'name_en')->get(),
            'managers' => User::whereIn('role', ['admin', 'manager', 'agent'])->select('id', 'name', 'role')->orderBy('name')->get(),
        ];
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

    public function togglePin(Unit $unit): RedirectResponse
    {
        $this->authorize('togglePin', $unit);

        $this->unitService->togglePin($unit->id);

        return redirect()->route('admin.units.index')
            ->with('success', __('admin.pin_success'));
    }

    public function toggleDeal(Unit $unit): RedirectResponse
    {
        $this->authorize('toggleDeal', $unit);

        $this->unitService->toggleDeal($unit->id);

        return redirect()->route('admin.units.index')
            ->with('success', __('admin.deal_success'));
    }

    public function toggleActive(Unit $unit, Request $request): RedirectResponse
    {
        $this->authorize('toggleActive', $unit);

        $this->unitService->toggleActive($unit->id, $request->user());

        return redirect()->route('admin.units.index')
            ->with('success', __('admin.activation_success'));
    }

    public function adjustPoints(Unit $unit, AdjustPointsRequest $request, AdjustUnitPointsAction $action): RedirectResponse
    {
        $action->execute($unit, (int) $request->input('points'), $request->user());

        return redirect()->route('admin.units.index')
            ->with('success', __('admin.points_adjusted_successfully'));
    }
}
