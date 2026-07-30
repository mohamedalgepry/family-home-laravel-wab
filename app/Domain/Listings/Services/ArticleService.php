<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Actions\CreateArticleAction;
use App\Domain\Listings\Actions\UpdateArticleAction;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ArticleService
{
    public function __construct(
        private readonly CreateArticleAction $createAction,
        private readonly UpdateArticleAction $updateAction,
    ) {}

    public function getPaginatedArticles(array $filters = []): LengthAwarePaginator
    {
        $query = Article::with(['category', 'images']);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title_en', 'like', "%{$search}%")
                    ->orWhere('title_ar', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('slug_ar', 'like', "%{$search}%")
                    ->orWhere('slug_en', 'like', "%{$search}%")
                    ->orWhere('content_en', 'like', "%{$search}%")
                    ->orWhere('content_ar', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['is_published'])) {
            $query->where('is_published', $filters['is_published'] === 'true' || $filters['is_published'] === true);
        }

        $sortField = $filters['sort'] ?? 'created_at';
        $sortDir = $filters['direction'] ?? 'desc';
        $allowedSorts = ['created_at', 'title', 'views_count'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $perPage = min((int) ($filters['per_page'] ?? 15), 50);

        return $query->paginate($perPage);
    }

    public function createArticle(CreateArticleData $data, ?string $coverImagePath = null, array $newImagePaths = [], array $newImageAlts = [], array $newImagePositions = []): Article
    {
        return DB::transaction(function () use ($data, $coverImagePath, $newImagePaths, $newImageAlts, $newImagePositions) {
            $article = Article::create($data->toArray());

            if ($coverImagePath) {
                $this->persistImagePaths($article, [$coverImagePath], 'header');
            }

            if (! empty($newImagePaths)) {
                foreach ($newImagePaths as $index => $path) {
                    $article->images()->create([
                        'path' => $path,
                        'alt_text' => $newImageAlts[$index] ?? null,
                        'position' => $newImagePositions[$index] ?? 'middle',
                    ]);
                }
            }

            return $article->load(['category', 'images']);
        });
    }

    public function updateArticle(int $articleId, CreateArticleData $data, array $deletedImageIds = [], ?string $coverImagePath = null, array $imageUpdates = [], array $newImagePaths = [], array $newImageAlts = [], array $newImagePositions = []): Article
    {
        return DB::transaction(function () use ($articleId, $data, $deletedImageIds, $coverImagePath, $imageUpdates, $newImagePaths, $newImageAlts, $newImagePositions) {
            $article = Article::findOrFail($articleId);

            $article->update($data->toArray());

            if (! empty($deletedImageIds)) {
                $images = ArticleImage::whereIn('id', $deletedImageIds)->where('article_id', $articleId)->get();
                foreach ($images as $image) {
                    Storage::disk('public')->delete($image->path);
                    $image->delete();
                }
            }

            if (! empty($imageUpdates)) {
                foreach ($imageUpdates as $imageId => $update) {
                    ArticleImage::where('id', $imageId)->where('article_id', $articleId)->update(
                        collect($update)->only(['alt_text', 'position', 'sort_order'])->toArray()
                    );
                }
            }

            if ($coverImagePath) {
                // Remove existing header images if setting a new cover
                $oldCovers = ArticleImage::where('article_id', $articleId)->where('position', 'header')->get();
                foreach ($oldCovers as $oldCover) {
                    Storage::disk('public')->delete($oldCover->path);
                    $oldCover->delete();
                }
                $this->persistImagePaths($article, [$coverImagePath], 'header');
            }

            if (! empty($newImagePaths)) {
                foreach ($newImagePaths as $index => $path) {
                    $article->images()->create([
                        'path' => $path,
                        'alt_text' => $newImageAlts[$index] ?? null,
                        'position' => $newImagePositions[$index] ?? 'middle',
                    ]);
                }
            }

            return $article->load(['category', 'images']);
        });
    }

    public function deleteArticle(int $articleId): void
    {
        $article = Article::with('images')->findOrFail($articleId);

        $imagePaths = $article->images->pluck('path')->toArray();

        DB::transaction(function () use ($article) {
            $article->images()->delete();
            $article->delete();
        });

        foreach ($imagePaths as $path) {
            Storage::disk('public')->delete($path);
        }
    }

    public function togglePublish(int $articleId): Article
    {
        $article = Article::findOrFail($articleId);
        $article->update([
            'is_published' => ! $article->is_published,
            'published_at' => $article->is_published ? null : now(),
        ]);

        return $article->fresh()->load(['category', 'images']);
    }

    private function persistImagePaths(Article $article, array $paths, string $position = 'inside'): void
    {
        $existingCount = $article->images()->count();

        foreach ($paths as $i => $path) {
            $article->images()->create([
                'path' => $path,
                'sort_order' => $existingCount + $i + 1,
                'position' => $position,
                'size' => 'medium',
            ]);
        }

        dispatch(new GenerateThumbnailsJob(
            modelType: Article::class,
            modelId: $article->id,
            paths: $paths,
        ))->afterCommit();
    }
}
