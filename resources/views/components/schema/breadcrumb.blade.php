@props(['items' => []])

@php
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

    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => $itemList,
    ];
@endphp

<script type="application/ld+json">
    {!! json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
