<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Actions\CreateProjectAction;
use App\Domain\Listings\Actions\DeleteProjectAction;
use App\Domain\Listings\Actions\UpdateProjectAction;
use App\Domain\Listings\DTOs\CreateProjectData;
use App\Domain\Listings\Models\Project;
use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use App\Domain\Users\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProjectService
{
    public function __construct(
        private readonly CreateProjectAction $createAction,
        private readonly UpdateProjectAction $updateAction,
        private readonly DeleteProjectAction $deleteAction,
    ) {}

    public function getPaginatedProjects(array $filters = [], ?User $user = null): LengthAwarePaginator
    {
        $query = Project::with(['area', 'images'])->withCount('units');

        if ($user !== null && ! $user->isAdmin()) {
            if ($user->isManager()) {
                $query->where('user_id', $user->id);
            } elseif ($user->isAgent()) {
                $query->where('user_id', $user->manager_id);
            }
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('slug_ar', 'like', "%{$search}%")
                    ->orWhere('slug_en', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['area_id'])) {
            $query->where('area_id', $filters['area_id']);
        }

        $sortField = $filters['sort'] ?? 'created_at';
        $sortDir = $filters['direction'] ?? 'desc';
        $allowedSorts = ['created_at', 'name', 'units_count'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $perPage = min((int) ($filters['per_page'] ?? 15), 50);

        return $query->paginate($perPage);
    }

    public function createProject(CreateProjectData $data, int $userId, array $imagePaths = []): Project
    {
        return DB::transaction(function () use ($data, $userId, $imagePaths) {
            $project = $this->createAction->execute($data, $userId);

            if (! empty($imagePaths)) {
                $this->persistImagePaths($project, $imagePaths);
            }

            $this->clearListingsCache();

            return $project->load(['area', 'images']);
        });
    }

    public function updateProject(int $projectId, CreateProjectData $data, array $newImagePaths = [], array $deletedImageIds = [], array $imageOrder = []): Project
    {
        return DB::transaction(function () use ($projectId, $data, $newImagePaths, $deletedImageIds, $imageOrder) {
            $project = $this->updateAction->execute($projectId, $data);

            if (! empty($deletedImageIds)) {
                $images = $project->images()->whereIn('id', $deletedImageIds)->get();
                foreach ($images as $image) {
                    Storage::disk('public')->delete($image->path);
                    $image->delete();
                }
            }

            if (! empty($imageOrder)) {
                foreach ($imageOrder as $order => $imageId) {
                    $project->images()->where('id', $imageId)->update(['sort_order' => $order + 1]);
                }
            }

            if (! empty($newImagePaths)) {
                $this->persistImagePaths($project, $newImagePaths);
            }

            $this->clearListingsCache();

            return $project->load(['area', 'images']);
        });
    }

    public function deleteProject(int $projectId): void
    {
        $project = Project::with('images')->findOrFail($projectId);

        $imagePaths = $project->images->pluck('path')->toArray();

        DB::transaction(function () use ($project, $projectId) {
            $project->images()->delete();
            $this->deleteAction->execute($projectId);
            $this->clearListingsCache();
        });

        foreach ($imagePaths as $path) {
            Storage::disk('public')->delete($path);
        }
    }

    private function clearListingsCache(): void
    {
        Cache::increment('listing_cache_version');
    }

    private function persistImagePaths(Project $project, array $paths): void
    {
        $existingCount = $project->images()->count();

        foreach ($paths as $i => $path) {
            $project->images()->create([
                'path' => $path,
                'sort_order' => $existingCount + $i + 1,
            ]);
        }

        dispatch(new GenerateThumbnailsJob(
            modelType: Project::class,
            modelId: $project->id,
            paths: $paths,
        ))->afterCommit();
    }
}
