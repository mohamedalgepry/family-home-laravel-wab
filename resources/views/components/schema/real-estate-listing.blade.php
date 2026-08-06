@props(['listing'])

@php
    $locale = app()->getLocale();
    $title = $listing->name ?? '';
    $desc = (string) str($listing->meta_description ?? $listing->description ?? '')->stripTags()->limit(160);
    $url = url()->current();
    $primaryImage = $listing->images?->firstWhere('is_primary', true) ?? $listing->images?->first();
    $imageUrl = $primaryImage ? asset('storage/'.$primaryImage->path) : asset('icon.png');

    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'RealEstateListing',
        '@id' => $url.'#listing',
        'name' => $title,
        'description' => $desc,
        'url' => $url,
        'image' => [$imageUrl],
        'datePosted' => $listing->created_at?->toIso8601String(),
        'dateModified' => $listing->updated_at?->toIso8601String(),
    ];

    if (isset($listing->price)) {
        $schema['offers'] = [
            '@type' => 'Offer',
            'price' => (float) $listing->price,
            'priceCurrency' => 'EGP',
            'availability' => 'https://schema.org/InStock',
            'url' => $url,
        ];
    }
    
    $schema = array_filter($schema, fn($v) => $v !== null);
@endphp

<script type="application/ld+json">
    {!! json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
