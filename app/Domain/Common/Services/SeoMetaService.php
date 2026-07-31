<?php

namespace App\Domain\Common\Services;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;

class SeoMetaService
{
    public function forListing(Unit|Project $listing, string $section): array
    {
        return $this->build(
            title: $listing->name.' - '.config('app.name'),
            description: $this->description($listing->meta_description ?? $listing->description),
            section: $section,
            model: $listing,
            schema: $this->listingSchema($listing),
        );
    }

    public function forArticle(Article $article): array
    {
        return $this->build(
            title: $article->title.' - '.config('app.name'),
            description: $this->description($article->meta_description ?? $article->content),
            section: 'articles',
            model: $article,
            schema: $this->articleSchema($article),
        );
    }

    private function build(string $title, string $description, string $section, Unit|Project|Article $model, array $schema): array
    {
        $locale = app()->getLocale();
        $slugField = "slug_{$locale}";
        $arSlug = $model->slug_ar ?? $model->slug;
        $enSlug = $model->slug_en ?? $model->slug;

        return [
            'title' => $title,
            'description' => $description,
            'image' => $this->imagePath($model->images),
            'canonical' => url("/{$locale}/{$section}/".($model->$slugField ?? $model->slug)),
            'hreflang' => [
                'ar' => url("/ar/{$section}/{$arSlug}"),
                'en' => url("/en/{$section}/{$enSlug}"),
                'x-default' => url("/ar/{$section}/{$arSlug}"),
            ],
            'schema' => '<script type="application/ld+json">'.json_encode($schema, JSON_UNESCAPED_UNICODE).'</script>',
        ];
    }

    private function listingSchema(Unit|Project $listing): array
    {
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'RealEstateListing',
            'name' => $listing->name,
            'description' => $this->description($listing->meta_description ?? $listing->description),
            'image' => $this->schemaImage($listing->images),
        ];

        if ($listing instanceof Unit) {
            $schema['offers'] = [
                '@type' => 'Offer',
                'price' => $listing->price,
                'priceCurrency' => 'EGP',
            ];
        }

        return $schema;
    }

    private function articleSchema(Article $article): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $article->title,
            'description' => $this->description($article->meta_description ?? $article->content),
            'image' => $this->schemaImage($article->images),
        ];
    }

    private function imagePath($images): ?string
    {
        return $images?->firstWhere('is_primary', true)?->path ?? $images?->first()?->path;
    }

    private function schemaImage($images): string
    {
        $image = $images?->firstWhere('is_primary', true) ?? $images?->first();

        return $image ? asset('storage/'.$image->path) : '';
    }

    private function description(?string $text): string
    {
        return (string) str($text ?? '')->stripTags()->limit(150);
    }
}
