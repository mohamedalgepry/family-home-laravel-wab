<?php

namespace App\Domain\Common\Services;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Services\SeoService;

class SeoMetaService
{
    public function forListing(Unit|Project $listing, string $section): array
    {
        return $this->build(
            title: ($listing->name ? $listing->name.' - ' : '').config('app.name'),
            description: $this->description($listing->meta_description ?? $listing->description),
            section: $section,
            model: $listing,
            schema: $this->listingSchema($listing),
        );
    }

    public function forArticle(Article $article): array
    {
        return $this->build(
            title: ($article->title ? $article->title.' - ' : '').config('app.name'),
            description: $this->description($article->meta_description ?? $article->content),
            section: 'articles',
            model: $article,
            schema: $this->articleSchema($article),
        );
    }

    public function forPage(string $pageKey, array $customMeta = []): array
    {
        $seoService = app(SeoService::class);

        return $seoService->forPage($pageKey, $customMeta);
    }

    private function build(string $title, string $description, string $section, Unit|Project|Article $model, array $schema): array
    {
        $locale = app()->getLocale();
        $slugField = "slug_{$locale}";
        $arSlug = $model->slug_ar ?? $model->slug;
        $enSlug = $model->slug_en ?? $model->slug;
        $relativeImage = $this->resolveImage($model->images);
        $ogType = $model instanceof Article || $model instanceof Unit ? 'article' : 'website';

        $keywords = $locale === 'ar'
            ? ($model->keywords_ar ?? $model->keywords ?? [])
            : ($model->keywords_en ?? $model->keywords ?? $model->keywords_ar ?? []);

        if (is_string($keywords)) {
            $decoded = json_decode($keywords, true);
            $keywords = is_array($decoded) ? $decoded : array_map('trim', explode(',', $keywords));
        }

        if (is_array($keywords)) {
            $keywords = array_values(array_filter($keywords));
        }

        return [
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'image' => $relativeImage,
            'canonical' => url("/{$locale}/{$section}/".($model->$slugField ?? $model->slug)),
            'hreflang' => [
                'ar' => url("/ar/{$section}/{$arSlug}"),
                'en' => url("/en/{$section}/{$enSlug}"),
                'x-default' => url("/ar/{$section}/{$arSlug}"),
            ],
            'og_type' => $ogType,
            'schema' => $schema,
        ];
    }

    private function listingSchema(Unit|Project $listing): array
    {
        $locale    = app()->getLocale();
        $slugField = "slug_{$locale}";
        $section   = $listing instanceof Unit ? 'units' : 'projects';
        $url       = url("/{$locale}/{$section}/".($listing->$slugField ?? $listing->slug));

        $isUnit = $listing instanceof Unit;

        $schema = array_filter([
            '@context'     => 'https://schema.org',
            '@type'        => 'RealEstateListing',
            '@id'          => $url.'#'.($isUnit ? 'listing' : 'project'),
            'name'         => $listing->name,
            'description'  => $this->description($listing->meta_description ?? $listing->description),
            'image'        => $this->resolveImage($listing->images, assetUrl: true) ?: null,
            'url'          => $url,
            'datePosted'   => $listing->created_at?->toIso8601String(),
            'dateModified' => $listing->updated_at?->toIso8601String(),
        ], fn($v) => $v !== null && $v !== '');

        if ($isUnit && $listing->price !== null) {
            $schema['offers'] = [
                '@type'         => 'Offer',
                'price'         => $listing->price,
                'priceCurrency' => config('app.currency', 'EGP'),
                'availability'  => 'https://schema.org/InStock',
                'url'           => $url,
            ];
        }

        $hasCoords = !empty($listing->latitude) && !empty($listing->longitude) && $listing->latitude != '0' && $listing->longitude != '0';
        $locationAddress = $listing->location_address ?? null;

        if ($hasCoords || !empty($locationAddress)) {
            $schema['contentLocation'] = array_filter([
                '@type'   => 'Place',
                'name'    => $listing->name,
                'address' => !empty($locationAddress) ? [
                    '@type'          => 'PostalAddress',
                    'streetAddress' => $locationAddress,
                ] : null,
                'geo'     => $hasCoords ? [
                    '@type'     => 'GeoCoordinates',
                    'latitude'  => (float) $listing->latitude,
                    'longitude' => (float) $listing->longitude,
                ] : null,
            ], fn($v) => $v !== null);
        }

        return $schema;
    }

    private function articleSchema(Article $article): array
    {
        $settingsService = app(\App\Domain\Listings\Services\SettingsService::class);
        $logoPath = $settingsService->get('site_logo');
        $logoUrl = $logoPath ? asset('storage/'.$logoPath) : asset('icon.png');

        return array_filter([
            '@context'      => 'https://schema.org',
            '@type'         => 'Article',
            'headline'      => $article->title,
            'description'   => $this->description($article->meta_description ?? $article->content),
            'image'         => $this->resolveImage($article->images, assetUrl: true) ?: null,
            'datePublished' => $article->created_at?->toIso8601String(),
            'dateModified'  => $article->updated_at?->toIso8601String(),
            'author'        => [
                '@type' => 'Organization',
                'name'  => config('app.name'),
                'url'   => url('/'),
            ],
            'publisher'     => [
                '@type' => 'Organization',
                'name'  => config('app.name'),
                'logo'  => [
                    '@type' => 'ImageObject',
                    'url'   => $logoUrl,
                ],
                'url'   => url('/'),
            ],
        ], fn($v) => $v !== null && $v !== '');
    }

    /**
     * Resolve the primary image path for a model's image collection.
     *
     * Falls back to the first image if no primary is set.
     *
     * @param  bool  $assetUrl  When true, returns a full public asset URL (for JSON-LD schema).
     *                          When false, returns the raw storage-relative path (for OG/meta tags).
     */
    private function resolveImage($images, bool $assetUrl = false): ?string
    {
        $image = $images?->firstWhere('is_primary', true) ?? $images?->first();

        if (! $image) {
            return null;
        }

        return $assetUrl ? asset('storage/'.$image->path) : $image->path;
    }

    private function description(?string $text): string
    {
        $clean = $text ?? '';

        // 1. Strip HTML tags
        $clean = strip_tags($clean);

        // 2. Strip markdown syntax characters so unit descriptions stored as
        //    markdown don't leak symbols like **bold**, ### heading, * list, - dash
        //    into the meta description / OG description.
        $clean = preg_replace('/\*{1,3}([^*]*)\*{1,3}/', '$1', $clean);   // **bold** / *italic* / ***bold-italic***
        $clean = preg_replace('/#{1,6}\s*/', '', $clean);                  // ### headings
        $clean = preg_replace('/^[\s\-\*\+]\s+/m', '', $clean);           // - list item / * list item / + list item
        $clean = preg_replace('/\[([^\]]+)\]\([^\)]+\)/', '$1', $clean);  // [link text](url)
        $clean = preg_replace('/`{1,3}[^`]*`{1,3}/', '', $clean);         // `code` / ```code```
        $clean = preg_replace('/_{1,2}([^_]*)_{1,2}/', '$1', $clean);     // __bold__ / _italic_

        // 3. Collapse whitespace and trim, then limit to 160 chars for SEO
        return (string) str($clean)->squish()->limit(160);
    }


}
