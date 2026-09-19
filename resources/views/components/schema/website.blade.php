@props(['searchUrl' => null])

@php
    $locale = app()->getLocale();
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'WebSite',
        '@id' => url("/{$locale}").'#website',
        'name' => config('app.name'),
        'url' => url("/{$locale}"),
        'potentialAction' => [
            '@type' => 'SearchAction',
            'target' => [
                '@type' => 'EntryPoint',
                'urlTemplate' => ($searchUrl ?? url("/{$locale}/units")).'?search={search_term_string}',
            ],
            'query-input' => 'required name=search_term_string',
        ],
    ];
@endphp

<script type="application/ld+json">
    {!! json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
