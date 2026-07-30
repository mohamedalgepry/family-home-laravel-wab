<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Services\PageViewService;
use App\Domain\Common\Support\Sanitizer;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController
{
    public function __construct(
        private readonly PageViewService $pageViewService,
    ) {}

    public function index(): Response
    {
        $articles = Article::where('is_published', true)
            ->with('images')
            ->orderByDesc('published_at')
            ->paginate(12);

        $categories = Category::orderBy('name_ar')->get(['id', 'name_ar', 'name_en', 'slug']);

        $currentCategory = null;
        if ($categorySlug = request('category')) {
            $category = Category::where(function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)
                    ->orWhere('slug_ar', $categorySlug)
                    ->orWhere('slug_en', $categorySlug);
            })->first();
            if ($category) {
                $articles = Article::where('is_published', true)
                    ->where('category_id', $category->id)
                    ->with('images')
                    ->orderByDesc('published_at')
                    ->paginate(12);

                $currentCategory = $category;
            }
        }

        return Inertia::render('Public/Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'currentCategory' => $currentCategory ? [
                'id' => $currentCategory->id,
                'name_ar' => $currentCategory->name_ar,
                'name_en' => $currentCategory->name_en,
                'slug' => $currentCategory->slug,
            ] : null,
        ]);
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

        $locale = app()->getLocale();
        $article->content_ar = Sanitizer::rich($article->content_ar ?? '');
        $article->content_en = Sanitizer::rich($article->content_en ?? '');
        $article->content = Sanitizer::rich($article->content ?? '');
        $slug = "slug_{$locale}";
        $currentSlug = $article->$slug ?? $article->slug;
        $arSlug = $article->slug_ar ?? $article->slug;
        $enSlug = $article->slug_en ?? $article->slug;

        $meta = [
            'title' => $article->title.' - '.config('app.name'),
            'description' => str($article->meta_description ?? $article->content)->stripTags()->limit(150),
            'image' => $article->images?->firstWhere('is_primary', true)?->path ?? $article->images?->first()?->path,
            'canonical' => url("/{$locale}/articles/{$currentSlug}"),
            'hreflang' => [
                'ar' => url("/ar/articles/{$arSlug}"),
                'en' => url("/en/articles/{$enSlug}"),
                'x-default' => url("/ar/articles/{$arSlug}"),
            ],
            'schema' => '<script type="application/ld+json">'.json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $article->title,
                'description' => str($article->meta_description ?? $article->content)->stripTags()->limit(150),
                'image' => $article->images?->firstWhere('is_primary', true) ? asset('storage/'.$article->images->firstWhere('is_primary', true)->path) : '',
            ], JSON_UNESCAPED_UNICODE).'</script>',
        ];

        return Inertia::render('Public/Articles/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ])->withViewData(['meta' => $meta]);
    }
}
