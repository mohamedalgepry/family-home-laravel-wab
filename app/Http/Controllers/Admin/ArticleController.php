<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Actions\StoreUploadedImagesAction;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Services\ArticleService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArticleRequest;
use App\Http\Requests\Admin\UpdateArticleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(
        private readonly ArticleService $articleService,
        private readonly StoreUploadedImagesAction $storeUploadedImagesAction,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Article::class);

        $filters = request()->only(['search', 'category_id', 'is_published', 'sort', 'direction', 'per_page']);

        $articles = $this->articleService->getPaginatedArticles($filters);

        $categories = Category::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']);

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Article::class);

        $categories = Category::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']);

        return Inertia::render('Admin/Articles/Form', [
            'article' => null,
            'categories' => $categories,
        ]);
    }

    public function edit(Article $article): Response
    {
        $this->authorize('update', $article);

        $article->load(['category', 'images']);
        $categories = Category::orderBy('name_ar')->get(['id', 'name_ar', 'name_en']);

        return Inertia::render('Admin/Articles/Form', [
            'article' => $article,
            'categories' => $categories,
        ]);
    }

    public function store(StoreArticleRequest $request)
    {
        $this->authorize('create', Article::class);

        $data = CreateArticleData::from($request->validated());

        $coverImagePath = null;
        if ($request->hasFile('cover_image')) {
            $coverImagePath = $this->storeUploadedImagesAction->execute([$request->file('cover_image')], 'articles')[0];
        }

        $imagePaths = $this->storeUploadedImagesAction->execute($request->file('images', []), 'articles');
        $newImageAlts = $request->input('new_image_alts', []);
        $newImagePositions = $request->input('new_image_positions', []);

        $this->articleService->createArticle(
            data: $data,
            coverImagePath: $coverImagePath,
            newImagePaths: $imagePaths,
            newImageAlts: $newImageAlts,
            newImagePositions: $newImagePositions
        );

        return redirect()->route('admin.articles.index')
            ->with('success', __('common.added_successfully'));
    }

    public function update(UpdateArticleRequest $request, Article $article)
    {
        $this->authorize('update', $article);

        $data = CreateArticleData::from($request->validated());

        $coverImagePath = null;
        if ($request->hasFile('cover_image')) {
            $coverImagePath = $this->storeUploadedImagesAction->execute([$request->file('cover_image')], 'articles')[0];
        }

        $newImagePaths = $this->storeUploadedImagesAction->execute($request->file('images', []), 'articles');
        $newImageAlts = $request->input('new_image_alts', []);
        $newImagePositions = $request->input('new_image_positions', []);

        $this->articleService->updateArticle(
            articleId: $article->id,
            data: $data,
            deletedImageIds: $request->input('deleted_image_ids', []),
            coverImagePath: $coverImagePath,
            imageUpdates: $request->input('image_updates', []),
            newImagePaths: $newImagePaths,
            newImageAlts: $newImageAlts,
            newImagePositions: $newImagePositions
        );

        return redirect()->route('admin.articles.index')
            ->with('success', __('common.updated_successfully'));
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->authorize('delete', $article);

        $this->articleService->deleteArticle($article->id);

        return redirect()->route('admin.articles.index')
            ->with('success', __('common.deleted_successfully'));
    }

    public function togglePublish(Article $article): RedirectResponse
    {
        $this->authorize('togglePublish', $article);

        $this->articleService->togglePublish($article->id);

        return redirect()->route('admin.articles.index')
            ->with('success', __('articles.publish_toggled'));
    }
}
