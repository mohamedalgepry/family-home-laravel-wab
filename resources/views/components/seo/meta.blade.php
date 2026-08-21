@props(['meta' => []])

@php
    $defaultTitle = config('app.name');
    $title = $meta['title'] ?? $defaultTitle;
    $description = $meta['description'] ?? '';
    $rawImage = $meta['image'] ?? null;
    $image = null;
    if (!empty($rawImage)) {
        if (str_starts_with($rawImage, 'http://') || str_starts_with($rawImage, 'https://')) {
            $image = $rawImage;
        } elseif (str_starts_with($rawImage, '/storage') || str_starts_with($rawImage, 'storage/')) {
            $image = asset(ltrim($rawImage, '/'));
        } else {
            $image = asset('storage/' . ltrim($rawImage, '/'));
        }
    }

    if (empty($image)) {
        $siteLogo = app(\App\Domain\Listings\Services\SettingsService::class)->get('site_logo');
        $image = $siteLogo ? asset('storage/' . ltrim($siteLogo, '/')) : asset('icon.webp');
    }

    $canonical = $meta['canonical'] ?? url()->current();
    $hreflang = $meta['hreflang'] ?? [];
    $ogType = $meta['og_type'] ?? 'website';
    $schemas = $meta['schema'] ?? [];
    $keywords = $meta['keywords'] ?? null;
    if (is_array($keywords)) {
        $keywords = implode(', ', array_filter($keywords));
    }
@endphp

<title inertia>{{ $title }}</title>
<meta name="description" content="{{ $description }}" inertia head-key="description">
@if(!empty($keywords))
<meta name="keywords" content="{{ $keywords }}" inertia head-key="keywords">
@endif
<meta name="author" content="mohamed algebry" inertia head-key="author">
@if(!empty($meta['robots']))
<meta name="robots" content="{{ $meta['robots'] }}" inertia head-key="robots">
@endif
<link rel="canonical" href="{{ $canonical }}" inertia head-key="canonical">

@foreach($hreflang as $lang => $url)
    <link rel="alternate" hreflang="{{ $lang }}" href="{{ $url }}" inertia head-key="hreflang-{{ $lang }}">
@endforeach

<!-- Open Graph / WhatsApp / Facebook / Telegram / LinkedIn -->
<meta property="og:type" content="{{ $ogType }}" inertia head-key="og:type">
<meta property="og:url" content="{{ $canonical }}" inertia head-key="og:url">
<meta property="og:title" content="{{ $title }}" inertia head-key="og:title">
<meta property="og:description" content="{{ $description }}" inertia head-key="og:description">
<meta property="og:image" content="{{ $image }}" inertia head-key="og:image">
<meta property="og:image:secure_url" content="{{ $image }}" inertia head-key="og:image:secure_url">
<meta property="og:image:width" content="1200" inertia head-key="og:image:width">
<meta property="og:image:height" content="630" inertia head-key="og:image:height">
<meta property="og:site_name" content="{{ config('app.name') }}" inertia head-key="og:site_name">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" inertia head-key="twitter:card">
<meta name="twitter:url" content="{{ $canonical }}" inertia head-key="twitter:url">
<meta name="twitter:title" content="{{ $title }}" inertia head-key="twitter:title">
<meta name="twitter:description" content="{{ $description }}" inertia head-key="twitter:description">
<meta name="twitter:image" content="{{ $image }}" inertia head-key="twitter:image">

<!-- Structured Data / JSON-LD -->
@if(!empty($schemas))
    @if(is_array($schemas) && isset($schemas[0]))
        @foreach($schemas as $s)
            <script type="application/ld+json">
                {!! json_encode($s, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) !!}
            </script>
        @endforeach
    @else
        <script type="application/ld+json">
            {!! json_encode($schemas, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) !!}
        </script>
    @endif
@endif
