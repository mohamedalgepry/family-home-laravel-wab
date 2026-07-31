@props(['meta' => []])

@php
    $defaultTitle = config('app.name');
    $title = $meta['title'] ?? $defaultTitle;
    $description = $meta['description'] ?? '';
    $keywords = $meta['keywords'] ?? '';
    $image = $meta['image'] ?? asset('icon.png');
    $canonical = $meta['canonical'] ?? url()->current();
    $hreflang = $meta['hreflang'] ?? [];
    $ogType = $meta['og_type'] ?? 'website';
    $schemas = $meta['schema'] ?? [];
@endphp

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}">
@if($keywords)
    <meta name="keywords" content="{{ $keywords }}">
@endif
<link rel="canonical" href="{{ $canonical }}">

@foreach($hreflang as $lang => $url)
    <link rel="alternate" hreflang="{{ $lang }}" href="{{ $url }}">
@endforeach

<!-- Open Graph / Facebook -->
<meta property="og:type" content="{{ $ogType }}">
<meta property="og:url" content="{{ $canonical }}">
<meta property="og:title" content="{{ $title }}">
<meta property="og:description" content="{{ $description }}">
<meta property="og:image" content="{{ $image }}">
<meta property="og:site_name" content="{{ config('app.name') }}">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="{{ $canonical }}">
<meta name="twitter:title" content="{{ $title }}">
<meta name="twitter:description" content="{{ $description }}">
<meta name="twitter:image" content="{{ $image }}">

<!-- Structured Data / JSON-LD -->
@if(!empty($schemas))
    @if(is_array($schemas) && isset($schemas[0]))
        @foreach($schemas as $s)
            <script type="application/ld+json">
                {!! json_encode($s, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
            </script>
        @endforeach
    @else
        <script type="application/ld+json">
            {!! json_encode($schemas, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
        </script>
    @endif
@endif
