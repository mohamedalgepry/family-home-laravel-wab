<?php

namespace App\Domain\Listings\Services;

use App\Domain\Common\QueryBuilders\ListingQueryBuilder;
use App\Domain\Common\QueryBuilders\UserScopeQueryBuilder;
use App\Domain\Listings\Actions\CreateProjectAction;
use App\Domain\Listings\Actions\DeleteProjectAction;
use App\Domain\Listings\Actions\UpdateProjectAction;
use App\Domain\Listings\DTOs\CreateProjectData;
use App\Domain\Listings\Models\Project;
use App\Domain\Users\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function __construct(
        private readonly CreateProjectAction $createAction,
        private readonly UpdateProjectAction $updateAction,
        private readonly DeleteProjectAction $deleteAction,
        private readonly ListingImageService $listingImageService,
        private readonly SitemapService $sitemapService,
    ) {}

    public function getPaginatedProjects(array $filters = [], ?User $user = null): LengthAwarePaginator
    {
        $query = Project::with(['area', 'images'])->withCount('units');

        UserScopeQueryBuilder::applyOwnershipScope($query, $user);
        ListingQueryBuilder::applySearch($query, $filters, ['name_en', 'name_ar', 'slug', 'slug_ar', 'slug_en', 'keywords_ar', 'keywords_en']);
        ListingQueryBuilder::applyExactMatches($query, $filters, ['area_id']);
        ListingQueryBuilder::applySort($query, $filters, ['created_at', 'name', 'units_count'], 'created_at');

        return $query->paginate(ListingQueryBuilder::perPage($filters));
    }

    public function createProject(CreateProjectData $data, int $userId, array $imagePaths = []): Project
    {
        $project = DB::transaction(function () use ($data, $userId, $imagePaths) {
            $project = $this->createAction->execute($data, $userId);

            if (! empty($imagePaths)) {
                $this->listingImageService->persistImages($project, $imagePaths);
            }

            $this->clearListingsCache();

            return $project->load(['area', 'images']);
        });

        // إضافة المشروع فوراً لـ Sitemap

        return $project;
    }

    public function updateProject(int $projectId, CreateProjectData $data, array $newImagePaths = [], array $deletedImageIds = [], array $imageOrder = []): Project
    {
        $project = DB::transaction(function () use ($projectId, $data, $newImagePaths, $deletedImageIds, $imageOrder) {
            $project = $this->updateAction->execute($projectId, $data);

            if (! empty($deletedImageIds)) {
                $images = $project->images()->whereIn('id', $deletedImageIds)->get();
                $this->listingImageService->deleteImageFiles($images->pluck('path')->all());
                foreach ($images as $image) {
                    $image->delete();
                }
            }

            if (! empty($imageOrder)) {
                foreach ($imageOrder as $order => $imageId) {
                    $project->images()->where('id', $imageId)->update(['sort_order' => $order + 1]);
                }
            }

            if (! empty($newImagePaths)) {
                $this->listingImageService->persistImages($project, $newImagePaths);
            }

            $this->clearListingsCache();

            return $project->load(['area', 'images']);
        });

        return $project;
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

        // حذف الصور الأصلية والـ Thumbnails من الـ Storage
        $this->listingImageService->deleteImageFiles($imagePaths);

        // إعادة توليد ملف sitemap.xml فوراً
        $this->sitemapService->regenerate();
    }

    private function clearListingsCache(): void
    {
        Cache::increment(ListingService::CACHE_VERSION_KEY);
    }
}
