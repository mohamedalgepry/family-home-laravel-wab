<?php

namespace App\Http\Controllers\Public;

use App\Domain\Common\Services\SeoMetaService;
use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\PageViewService;
use App\Http\Resources\Public\ArticlePublicResource;
use App\Http\Resources\Public\UnitPublicResource;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController
{
    public function __construct(
        private readonly PageViewService $pageViewService,
        private readonly SeoMetaService $seoMetaService,
    ) {}

    public function index(): Response
    {
        $currentCategory = null;
        $categorySlug = request('category');

        if ($categorySlug) {
            $category = Category::where(function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)
                    ->orWhere('slug_ar', $categorySlug)
                    ->orWhere('slug_en', $categorySlug);
            })->first();

            if ($category) {
                $currentCategory = $category;
            }
        }

        $articles = $this->publishedArticles($currentCategory?->id);

        $categories = Category::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']);

        $customMeta = [];
        if ($currentCategory) {
            $catName = app()->getLocale() === 'ar' ? ($currentCategory->name_ar ?? $currentCategory->name) : ($currentCategory->name_en ?? $currentCategory->name);
            $customMeta['title'] = (app()->getLocale() === 'ar' ? 'مقالات ' : 'Articles in ').$catName.' - '.config('app.name');
        }

        $meta = app(SeoService::class)->forPage('articles_index', $customMeta);

        return Inertia::render('Public/Articles/Index', [
            'articles' => ArticlePublicResource::collection($articles),
            'categories' => $categories,
            'seo_meta' => $meta,
            'currentCategory' => $currentCategory ? [
                'id' => $currentCategory->id,
                'name_ar' => $currentCategory->name_ar,
                'name_en' => $currentCategory->name_en,
                'slug' => $currentCategory->slug,
            ] : null,
        ])->withViewData(['meta' => $meta]);
    }

    public function show(string $slug): Response
    {
        $article = Article::where(function ($q) use ($slug) {
            $q->where('slug', $slug)
                ->orWhere('slug_ar', $slug)
                ->orWhere('slug_en', $slug);
        })
            ->where('is_published', true)
            ->with(['category', 'images'])
            ->firstOrFail();

        $this->pageViewService->recordView(
            Article::class,
            $article->id,
            request()->ip(),
            request()->userAgent(),
        );

        $relatedArticles = Article::where('is_published', true)
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->with('images')
            ->orderByDesc('published_at')
            ->limit(4)
            ->get();

        if ($relatedArticles->count() < 4) {
            $moreArticles = Article::where('is_published', true)
                ->where('id', '!=', $article->id)
                ->whereNotIn('id', $relatedArticles->pluck('id'))
                ->with('images')
                ->inRandomOrder()
                ->limit(4 - $relatedArticles->count())
                ->get();
            $relatedArticles = $relatedArticles->concat($moreArticles);
        }

        $suggestedUnits = Unit::where('is_active', true)
            ->with(['images', 'area'])
            ->inRandomOrder()
            ->limit(3)
            ->get();

        // نمرّر لغة واحدة فقط (لغة العرض الحالية) بدلاً من إرسال content_ar + content_en + content معاً
        $rawContent = app()->getLocale() === 'ar'
            ? ($article->content_ar ?: $article->content)
            : ($article->content_en ?: $article->content);
        $article->content = Sanitizer::rich($rawContent);
        unset($article->content_ar, $article->content_en);

        $meta = $this->seoMetaService->forArticle($article);

        return Inertia::render('Public/Articles/Show', [
            'article' => ArticlePublicResource::make($article)->resolve(),
            'relatedArticles' => ArticlePublicResource::collection($relatedArticles),
            'suggestedUnits' => UnitPublicResource::collection($suggestedUnits),
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta]);
    }

    private function publishedArticles(?int $categoryId)
    {
        return Article::where('is_published', true)
            ->when($categoryId, fn ($query) => $query->where('category_id', $categoryId))
            ->with(['images', 'category'])
            ->orderByDesc('published_at')
            ->paginate(12);
    }
}
