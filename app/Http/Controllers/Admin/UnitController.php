<?php

namespace App\Http\Controllers\Admin;

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
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdjustPointsRequest;
use App\Http\Requests\Admin\StoreUnitRequest;
use App\Http\Requests\Admin\UpdateUnitRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function __construct(
        private readonly UnitService $unitService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Unit::class);

        $user = request()->user();
        $filters = request()->only(['search', 'area_id', 'type_id', 'sort', 'direction', 'per_page']);

        $units = $this->unitService->getPaginatedUnits($filters, $user);

        $areas = Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get();
        $unitTypes = UnitType::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get();

        return Inertia::render('Admin/Units/Index', [
            'units' => $units,
            'areas' => $areas,
            'unitTypes' => $unitTypes,
            'filters' => $filters,
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
        return [
            'areas' => Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'unitTypes' => UnitType::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'projects' => Project::select('id', 'name_ar', 'name_en')->when(! $user->isAdmin(), function ($q) use ($user) {
                $q->where('user_id', $user->isManager() ? $user->id : $user->manager_id);
            })->orderBy('name_en')->get(),
            'features' => Feature::select('id', 'name_ar', 'name_en')->get(),
            'finishingTypes' => FinishingType::select('id', 'name_ar', 'name_en')->get(),
        ];
    }

    public function store(StoreUnitRequest $request): RedirectResponse
    {
        $this->authorize('create', Unit::class);
        $data = CreateUnitData::from($request->validated());

        $primaryImageIndex = (int) $request->input('primary_image_index', 0);
        $imagePaths = $this->storeUploadedImages($request->file('images', []));

        $this->unitService->createUnit(
            data: $data,
            user: $request->user(),
            imagePaths: $imagePaths,
            primaryImageIndex: $primaryImageIndex,
        );

        return redirect()->route('admin.units.index')
            ->with('success', __('messages.added_successfully'));
    }

    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        $this->authorize('update', $unit);

        $data = CreateUnitData::from($request->validated());

        $primaryImageIndex = (int) $request->input('primary_image_index', 0);
        $newImagePaths = $this->storeUploadedImages($request->file('images', []));

        $this->unitService->updateUnit(
            unitId: $unit->id,
            data: $data,
            user: $request->user(),
            newImagePaths: $newImagePaths,
            primaryImageIndex: $primaryImageIndex,
        );

        return redirect()->route('admin.units.index')
            ->with('success', __('messages.updated_successfully'));
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        $this->authorize('delete', $unit);

        $this->unitService->deleteUnit($unit->id);

        return redirect()->route('admin.units.index')
            ->with('success', __('messages.deleted_successfully'));
    }

    public function removeImage(Unit $unit, UnitImage $image): RedirectResponse
    {
        $this->authorize('update', $unit);

        $this->unitService->removeImage($unit->id, $image->id);

        return back()->with('success', __('common.deleted_successfully'));
    }

    public function setPrimaryImage(Unit $unit, UnitImage $image): RedirectResponse
    {
        $this->authorize('update', $unit);

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

    public function toggleActive(Unit $unit, \Illuminate\Http\Request $request): RedirectResponse
    {
        $this->authorize('toggleActive', $unit);

        $this->unitService->toggleActive($unit->id, $request->user());

        return redirect()->route('admin.units.index')
            ->with('success', __('admin.activation_success'));
    }

    public function adjustPoints(Unit $unit, AdjustPointsRequest $request, AdjustUnitPointsAction $action): RedirectResponse
    {
        $this->authorize('allocate-points', $unit);

        $action->execute($unit, (int) $request->input('points'), $request->user());

        return redirect()->route('admin.units.index')
            ->with('success', __('admin.points_adjusted_successfully'));
    }

    private function storeUploadedImages(array $images): array
    {
        $paths = [];
        $year = now()->format('Y');
        $month = now()->format('m');

        foreach ($images as $image) {
            if ($image instanceof UploadedFile) {
                $paths[] = $image->store("units/{$year}/{$month}", 'public');
            }
        }

        return $paths;
    }
}
