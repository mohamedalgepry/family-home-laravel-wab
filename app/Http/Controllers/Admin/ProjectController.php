<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Actions\StoreUploadedImagesAction;
use App\Domain\Listings\DTOs\CreateProjectData;
use App\Domain\Listings\Jobs\NotifyNewProjectJob;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Services\ProjectService;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
        private readonly StoreUploadedImagesAction $storeUploadedImagesAction,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Project::class);

        $user = auth()->user();
        $filters = request()->only(['search', 'area_id', 'sort', 'direction', 'per_page']);

        $projects = $this->projectService->getPaginatedProjects(
            filters: $filters,
            user: $user,
        );

        $stats = [
            'total' => Project::count(),
            'active' => Project::where('is_active', true)->count(),
            'total_units' => Project::withCount('units')->get()->sum('units_count') ?? 0,
        ];

        $areas = Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'stats' => $stats,
            'areas' => $areas,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        $formData = $this->getFormData();
        $formData['project'] = null;

        return Inertia::render('Admin/Projects/Form', $formData);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        $project->load(['area', 'images', 'features']);

        $formData = $this->getFormData();
        $formData['project'] = $project;

        return Inertia::render('Admin/Projects/Form', $formData);
    }

    private function getFormData(): array
    {
        return [
            'areas' => Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'features' => Feature::select('id', 'name_ar', 'name_en')->get(),
            'finishingTypes' => FinishingType::select('id', 'name_ar', 'name_en')->get(),
            'managers' => User::whereIn('role', ['admin', 'manager'])->select('id', 'name', 'role')->orderBy('name')->get(),
        ];
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        $validated = $request->validated();
        $userId = auth()->id();
        if ($request->user()->isAdmin()) {
            if (! empty($validated['user_id'])) {
                $userId = (int) $validated['user_id'];
            } elseif (! empty($validated['manager_id'])) {
                $userId = (int) $validated['manager_id'];
            }
        }
        $validated['user_id'] = $userId;

        $data = CreateProjectData::from($validated);
        $imagePaths = $this->storeUploadedImagesAction->execute($request->file('images', []), 'projects');

        $project = $this->projectService->createProject(
            data: $data,
            userId: $userId,
            imagePaths: $imagePaths,
        );

        NotifyNewProjectJob::dispatch($project);

        return redirect()->route('admin.projects.index')
            ->with('success', __('common.added_successfully'));
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $validated = $request->validated();
        if (! $request->user()->isAdmin()) {
            unset($validated['user_id'], $validated['manager_id']);
        } else {
            if (empty($validated['user_id']) && ! empty($validated['manager_id'])) {
                $validated['user_id'] = $validated['manager_id'];
            }
        }

        $data = CreateProjectData::from($validated);
        $newImagePaths = $this->storeUploadedImagesAction->execute($request->file('images', []), 'projects');

        $updatedProject = $this->projectService->updateProject(
            projectId: $project->id,
            data: $data,
            newImagePaths: $newImagePaths,
            deletedImageIds: $request->input('deleted_image_ids', []),
            imageOrder: $request->input('image_order', []),
        );

        if ($request->user()->isAdmin() && ! empty($validated['user_id'])) {
            $updatedProject->user_id = (int) $validated['user_id'];
            $updatedProject->save();
        }

        return redirect()->route('admin.projects.index')
            ->with('success', __('common.updated_successfully'));
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $this->projectService->deleteProject($project->id);

        return redirect()->route('admin.projects.index')
            ->with('success', __('common.deleted_successfully'));
    }

    public function autofill(Project $project)
    {
        $this->authorize('view', $project);

        return response()->json([
            'features' => $project->features->pluck('id')->toArray(),
            'finishing_type_id' => $project->finishing_type_id,
            'payment_method' => $project->payment_method,
            'down_payment' => $project->down_payment,
            'installment_years' => $project->installment_years,
        ]);
    }
}
