<?php

namespace App\Services;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\PageSeo;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\SettingsService;
use Illuminate\Support\Facades\Cache;

class SeoService
{
    public function __construct(
        private readonly SettingsService $settingsService,
    ) {}

    public function forUnit(Unit $unit): array
    {
        $locale = app()->getLocale();
        $title = ($unit->name ? $unit->name.' - ' : '').config('app.name');
        $desc = $this->cleanText($unit->meta_description ?? $unit->description);
        $keywords = $this->formatKeywords($unit->keywords);

        $arSlug = $unit->slug_ar ?? $unit->slug;
        $enSlug = $unit->slug_en ?? $unit->slug;
        $currentSlug = $locale === 'ar' ? $arSlug : $enSlug;

        $canonical = url("/{$locale}/units/{$currentSlug}");
        $hreflang = [
            'ar' => url("/ar/units/{$arSlug}"),
            'en' => url("/en/units/{$enSlug}"),
            'x-default' => url("/ar/units/{$arSlug}"),
        ];

        $primaryImage = $unit->images?->firstWhere('is_primary', true) ?? $unit->images?->first();
        $imageUrl = $primaryImage ? asset('storage/'.$primaryImage->path) : asset('icon.png');

        $schema = [
            $this->getBreadcrumbSchema([
                __('seo.site_name') => url("/{$locale}"),
                __('seo.search_title') => url("/{$locale}/units"),
                $unit->name => $canonical,
            ]),
            [
                '@context' => 'https://schema.org',
                '@type' => 'RealEstateListing',
                '@id' => $canonical.'#listing',
                'name' => $unit->name,
                'description' => $desc,
                'url' => $canonical,
                'image' => [$imageUrl],
                'datePosted' => $unit->created_at?->toIso8601String(),
                'dateModified' => $unit->updated_at?->toIso8601String(),
                'offers' => [
                    '@type' => 'Offer',
                    'price' => (float) $unit->price,
                    'priceCurrency' => 'EGP',
                    'availability' => 'https://schema.org/InStock',
                    'url' => $canonical,
                ],
                'containedInPlace' => [
                    '@type' => 'Place',
                    'name' => $unit->area?->name ?? 'مصر',
                    'address' => [
                        '@type' => 'PostalAddress',
                        'addressLocality' => $unit->area?->name ?? '',
                        'addressCountry' => 'EG',
                    ],
                ],
            ],
        ];

        return $this->buildMeta([
            'title' => $title,
            'description' => $desc,
            'keywords' => $keywords,
            'image' => $imageUrl,
            'canonical' => $canonical,
            'hreflang' => $hreflang,
            'og_type' => 'article',
            'schema' => $schema,
        ]);
    }

    public function forProject(Project $project): array
    {
        $locale = app()->getLocale();
        $title = ($project->name ? $project->name.' - ' : '').config('app.name');
        $desc = $this->cleanText($project->meta_description ?? $project->description);
        $keywords = $this->formatKeywords($project->keywords);

        $arSlug = $project->slug_ar ?? $project->slug;
        $enSlug = $project->slug_en ?? $project->slug;
        $currentSlug = $locale === 'ar' ? $arSlug : $enSlug;

        $canonical = url("/{$locale}/projects/{$currentSlug}");
        $hreflang = [
            'ar' => url("/ar/projects/{$arSlug}"),
            'en' => url("/en/projects/{$enSlug}"),
            'x-default' => url("/ar/projects/{$arSlug}"),
        ];

        $primaryImage = $project->images?->firstWhere('is_primary', true) ?? $project->images?->first();
        $imageUrl = $primaryImage ? asset('storage/'.$primaryImage->path) : asset('icon.png');

        $schema = [
            $this->getBreadcrumbSchema([
                __('seo.site_name') => url("/{$locale}"),
                __('seo.projects_title') => url("/{$locale}/projects"),
                $project->name => $canonical,
            ]),
            [
                '@context' => 'https://schema.org',
                '@type' => 'RealEstateListing',
                '@id' => $canonical.'#project',
                'name' => $project->name,
                'description' => $desc,
                'url' => $canonical,
                'image' => [$imageUrl],
                'datePosted' => $project->created_at?->toIso8601String(),
                'dateModified' => $project->updated_at?->toIso8601String(),
            ],
        ];

        return $this->buildMeta([
            'title' => $title,
            'description' => $desc,
            'keywords' => $keywords,
            'image' => $imageUrl,
            'canonical' => $canonical,
            'hreflang' => $hreflang,
            'og_type' => 'website',
            'schema' => $schema,
        ]);
    }

    public function forArticle(Article $article): array
    {
        $locale = app()->getLocale();
        $title = ($article->title ? $article->title.' - ' : '').config('app.name');
        $desc = $this->cleanText($article->meta_description ?? $article->content);
        $keywords = $this->formatKeywords($article->keywords);

        $arSlug = $article->slug_ar ?? $article->slug;
        $enSlug = $article->slug_en ?? $article->slug;
        $currentSlug = $locale === 'ar' ? $arSlug : $enSlug;

        $canonical = url("/{$locale}/articles/{$currentSlug}");
        $hreflang = [
            'ar' => url("/ar/articles/{$arSlug}"),
            'en' => url("/en/articles/{$enSlug}"),
            'x-default' => url("/ar/articles/{$arSlug}"),
        ];

        $primaryImage = $article->images?->firstWhere('is_primary', true) ?? $article->images?->first();
        $imageUrl = $primaryImage ? asset('storage/'.$primaryImage->path) : asset('icon.png');

        $schema = [
            $this->getBreadcrumbSchema([
                __('seo.site_name') => url("/{$locale}"),
                __('seo.articles_title') => url("/{$locale}/articles"),
                $article->title => $canonical,
            ]),
            [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                '@id' => $canonical.'#article',
                'headline' => $article->title,
                'description' => $desc,
                'url' => $canonical,
                'image' => [$imageUrl],
                'datePublished' => $article->created_at?->toIso8601String(),
                'dateModified' => $article->updated_at?->toIso8601String(),
                'author' => [
                    '@type' => 'Organization',
                    'name' => config('app.name'),
                ],
            ],
        ];

        return $this->buildMeta([
            'title' => $title,
            'description' => $desc,
            'keywords' => $keywords,
            'image' => $imageUrl,
            'canonical' => $canonical,
            'hreflang' => $hreflang,
            'og_type' => 'article',
            'schema' => $schema,
        ]);
    }

    public function forPage(string $pageKey, array $customMeta = []): array
    {
        $locale = app()->getLocale();
        $dbSeo = $this->getPageSeoFromDb($pageKey, $locale);

        $defaultTitle = __('seo.'.$pageKey.'_title');
        if ($defaultTitle === 'seo.'.$pageKey.'_title') {
            $defaultTitle = __('seo.default_title');
        }

        $defaultDesc = __('seo.'.$pageKey.'_description');
        if ($defaultDesc === 'seo.'.$pageKey.'_description') {
            $defaultDesc = __('seo.default_description');
        }

        $title = $customMeta['title'] ?? $dbSeo['title'] ?? $defaultTitle;
        $desc = $customMeta['description'] ?? $dbSeo['description'] ?? $defaultDesc;
        $keywords = $customMeta['keywords'] ?? $dbSeo['keywords'] ?? __('seo.default_keywords');

        $path = $pageKey === 'home' ? '' : "/{$pageKey}";
        $canonical = url("/{$locale}{$path}");
        $hreflang = [
            'ar' => url("/ar{$path}"),
            'en' => url("/en{$path}"),
            'x-default' => url("/ar{$path}"),
        ];

        $siteLogo = $this->settingsService->get('site_logo');
        $imageUrl = $siteLogo ? asset('storage/'.$siteLogo) : asset('icon.png');

        $schemas = [];
        if ($pageKey === 'home') {
            $schemas[] = $this->getWebsiteSchema();
            $schemas[] = $this->getRealEstateAgentSchema();
        } else {
            $schemas[] = $this->getBreadcrumbSchema([
                __('seo.site_name') => url("/{$locale}"),
                $title => $canonical,
            ]);
        }

        return $this->buildMeta([
            'title' => $title,
            'description' => $this->cleanText($desc),
            'keywords' => is_array($keywords) ? implode(', ', $keywords) : $keywords,
            'image' => $imageUrl,
            'canonical' => $canonical,
            'hreflang' => $hreflang,
            'og_type' => 'website',
            'schema' => $schemas,
        ]);
    }

    public function getWebsiteSchema(): array
    {
        $locale = app()->getLocale();
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => url("/{$locale}").'#website',
            'name' => config('app.name'),
            'url' => url("/{$locale}"),
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => url("/{$locale}/units").'?search={search_term_string}',
                ],
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    public function getRealEstateAgentSchema(): array
    {
        $locale = app()->getLocale();
        $siteLogo = $this->settingsService->get('site_logo');
        $logoUrl = $siteLogo ? asset('storage/'.$siteLogo) : asset('icon.png');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'RealEstateAgent',
            '@id' => url("/{$locale}").'#agent',
            'name' => __('seo.company_name'),
            'url' => url("/{$locale}"),
            'logo' => $logoUrl,
            'image' => $logoUrl,
            'telephone' => $this->settingsService->get('company_phone') ?: '+201000000000',
            'email' => $this->settingsService->get('company_email') ?: 'info@familyhome-co.com',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $this->settingsService->get('company_address') ?: 'القاهرة، مصر',
                'addressCountry' => 'EG',
            ],
        ];
    }

    public function getBreadcrumbSchema(array $items): array
    {
        $itemList = [];
        $position = 1;

        foreach ($items as $name => $url) {
            $itemList[] = [
                '@type' => 'ListItem',
                'position' => $position++,
                'name' => $name,
                'item' => $url,
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $itemList,
        ];
    }

    private function buildMeta(array $params): array
    {
        return [
            'title' => $params['title'] ?? config('app.name'),
            'description' => $params['description'] ?? '',
            'keywords' => $params['keywords'] ?? '',
            'image' => $params['image'] ?? asset('icon.png'),
            'canonical' => $params['canonical'] ?? url()->current(),
            'hreflang' => $params['hreflang'] ?? [],
            'og_type' => $params['og_type'] ?? 'website',
            'schema' => $params['schema'] ?? [],
        ];
    }

    private function getPageSeoFromDb(string $pageKey, string $locale): array
    {
        try {
            $pages = Cache::remember('seo_pages_cache', 3600, fn () => PageSeo::all()->keyBy('page_key')->toArray());
            $page = $pages[$pageKey] ?? null;

            if ($page) {
                return [
                    'title' => $locale === 'ar' ? ($page['meta_title_ar'] ?? null) : ($page['meta_title_en'] ?? null),
                    'description' => $locale === 'ar' ? ($page['meta_description_ar'] ?? null) : ($page['meta_description_en'] ?? null),
                    'keywords' => $locale === 'ar' ? ($page['keywords_ar'] ?? null) : ($page['keywords_en'] ?? null),
                ];
            }
        } catch (\Throwable $e) {
        }

        return [];
    }

    private function cleanText(?string $text): string
    {
        return (string) str($text ?? '')->stripTags()->squish()->limit(160);
    }

    private function formatKeywords(mixed $keywords): string
    {
        if (is_array($keywords)) {
            return implode(', ', array_filter($keywords));
        }

        return (string) $keywords;
    }
}
