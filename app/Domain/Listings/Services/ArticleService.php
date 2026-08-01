<?php

namespace App\Domain\Listings\Services;

use App\Domain\Common\QueryBuilders\ListingQueryBuilder;
use App\Domain\Listings\Actions\CreateArticleAction;
use App\Domain\Listings\Actions\UpdateArticleAction;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\ArticleImage;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ArticleService
{
    public function __construct(
        private readonly CreateArticleAction $createAction,
        private readonly UpdateArticleAction $updateAction,
        private readonly SitemapService $sitemapService,
        private readonly ListingImageService $listingImageService,
    ) {}

    public function getPaginatedArticles(array $filters = []): LengthAwarePaginator
    {
        $query = Article::with(['category', 'images']);

        ListingQueryBuilder::applySearch($query, $filters, ['title_en', 'title_ar', 'slug', 'slug_ar', 'slug_en', 'content_en', 'content_ar']);
        ListingQueryBuilder::applyExactMatches($query, $filters, ['category_id']);
        ListingQueryBuilder::applyBoolean($query, $filters, 'is_published');
        ListingQueryBuilder::applySort($query, $filters, ['created_at', 'title', 'views_count'], 'created_at');

        return $query->paginate(ListingQueryBuilder::perPage($filters));
    }

    public function createArticle(CreateArticleData $data, ?string $coverImagePath = null, array $newImagePaths = [], array $newImageAlts = [], array $newImagePositions = []): Article
    {
        $article = DB::transaction(function () use ($data, $coverImagePath, $newImagePaths, $newImageAlts, $newImagePositions) {
            $article = $this->createAction->execute($data);

            if ($coverImagePath) {
                $this->listingImageService->persistImages($article, [$coverImagePath], ['position' => 'header', 'size' => 'medium']);
            }

            if (! empty($newImagePaths)) {
                $this->listingImageService->persistImages($article, $newImagePaths, fn ($index) => [
                    'alt_text' => $newImageAlts[$index] ?? null,
                    'position' => $newImagePositions[$index] ?? 'middle',
                ]);
            }

            return $article->load(['category', 'images']);
        });

        $this->sitemapService->regenerate();

        return $article;
    }

    public function updateArticle(int $articleId, CreateArticleData $data, array $deletedImageIds = [], ?string $coverImagePath = null, array $imageUpdates = [], array $newImagePaths = [], array $newImageAlts = [], array $newImagePositions = []): Article
    {
        $article = DB::transaction(function () use ($articleId, $data, $deletedImageIds, $coverImagePath, $imageUpdates, $newImagePaths, $newImageAlts, $newImagePositions) {
            $article = $this->updateAction->execute($articleId, $data);

            if (! empty($deletedImageIds)) {
                $images = ArticleImage::whereIn('id', $deletedImageIds)->where('article_id', $articleId)->get();
                $this->listingImageService->deleteImageFiles($images->pluck('path')->all());
                foreach ($images as $image) {
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
                $this->listingImageService->deleteImageFiles($oldCovers->pluck('path')->all());
                foreach ($oldCovers as $oldCover) {
                    $oldCover->delete();
                }
                $this->listingImageService->persistImages($article, [$coverImagePath], ['position' => 'header', 'size' => 'medium']);
            }

            if (! empty($newImagePaths)) {
                $this->listingImageService->persistImages($article, $newImagePaths, fn ($index) => [
                    'alt_text' => $newImageAlts[$index] ?? null,
                    'position' => $newImagePositions[$index] ?? 'middle',
                ]);
            }

            return $article->load(['category', 'images']);
        });

        $this->sitemapService->regenerate();

        return $article;
    }

    public function deleteArticle(int $articleId): void
    {
        $article = Article::with('images')->findOrFail($articleId);

        $imagePaths = $article->images->pluck('path')->toArray();

        DB::transaction(function () use ($article) {
            $article->images()->delete();
            $article->delete();
        });

        // حذف الصور الأصلية والـ Thumbnails من الـ Storage
        $this->listingImageService->deleteImageFiles($imagePaths);

        $this->sitemapService->regenerate();
    }

    public function togglePublish(int $articleId): Article
    {
        $article = Article::findOrFail($articleId);
        $article->update([
            'is_published' => ! $article->is_published,
            'published_at' => $article->is_published ? null : now(),
        ]);

        $this->sitemapService->regenerate();

        return $article->fresh()->load(['category', 'images']);
    }
}
