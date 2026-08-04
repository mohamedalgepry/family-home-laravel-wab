<?php

namespace App\Domain\Listings\Services;

use App\Domain\Common\QueryBuilders\ListingQueryBuilder;
use App\Domain\Listings\Actions\CreateArticleAction;
use App\Domain\Listings\Actions\UpdateArticleAction;
use App\Domain\Listings\DTOs\ArticleImageData;
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

    public function createArticle(
        CreateArticleData $data,
        ?string $coverImagePath = null,
        ArticleImageData $newImages = new ArticleImageData(paths: []),
    ): Article {
        $article = DB::transaction(function () use ($data, $coverImagePath, $newImages) {
            $article = $this->createAction->execute($data);

            if ($coverImagePath) {
                $this->persistCoverImage($article, $coverImagePath);
            }

            if ($newImages->hasImages()) {
                $this->persistNewImages($article, $newImages);
            }

            return $article->load(['category', 'images']);
        });

        $this->sitemapService->regenerate();

        return $article;
    }

    public function updateArticle(
        int $articleId,
        CreateArticleData $data,
        array $deletedImageIds = [],
        ?string $coverImagePath = null,
        array $imageUpdates = [],
        ArticleImageData $newImages = new ArticleImageData(paths: []),
    ): Article {
        $article = DB::transaction(function () use ($articleId, $data, $deletedImageIds, $coverImagePath, $imageUpdates, $newImages) {
            $article = $this->updateAction->execute($articleId, $data);

            $this->deleteRequestedImages($articleId, $deletedImageIds);
            $this->applyImageUpdates($articleId, $imageUpdates);

            if ($coverImagePath) {
                $this->replaceCoverImage($articleId, $article, $coverImagePath);
            }

            if ($newImages->hasImages()) {
                $this->persistNewImages($article, $newImages);
            }

            return $article->load(['category', 'images']);
        });

        $this->sitemapService->regenerate();

        return $article;
    }

    public function deleteArticle(int $articleId): void
    {
        $article = Article::with('images')->findOrFail($articleId);

        $imagePaths = $article->images->pluck('path')->all();

        DB::transaction(function () use ($article) {
            $article->images()->delete();
            $article->delete();
        });

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

    private function persistCoverImage(Article $article, string $path): void
    {
        $this->listingImageService->persistImages($article, [$path], ['position' => 'header', 'size' => 'medium']);
    }

    private function persistNewImages(Article $article, ArticleImageData $images): void
    {
        $this->listingImageService->persistImages(
            $article,
            $images->paths,
            fn (int $index) => $images->metaForIndex($index),
        );
    }

    private function deleteRequestedImages(int $articleId, array $imageIds): void
    {
        if (empty($imageIds)) {
            return;
        }

        $images = ArticleImage::whereIn('id', $imageIds)->where('article_id', $articleId)->get();
        $this->listingImageService->deleteImageFiles($images->pluck('path')->all());
        foreach ($images as $image) {
            $image->delete();
        }
    }

    private function applyImageUpdates(int $articleId, array $imageUpdates): void
    {
        if (empty($imageUpdates)) {
            return;
        }

        foreach ($imageUpdates as $imageId => $update) {
            ArticleImage::where('id', $imageId)
                ->where('article_id', $articleId)
                ->update(collect($update)->only(['alt_text', 'link_url', 'position', 'sort_order'])->toArray());
        }
    }

    private function replaceCoverImage(int $articleId, Article $article, string $newCoverPath): void
    {
        $existingCovers = ArticleImage::where('article_id', $articleId)->where('position', 'header')->get();
        $this->listingImageService->deleteImageFiles($existingCovers->pluck('path')->all());
        foreach ($existingCovers as $cover) {
            $cover->delete();
        }

        $this->persistCoverImage($article, $newCoverPath);
    }
}
