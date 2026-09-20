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

    // WhatsApp and Facebook require JPG or PNG under 300KB (WebP is rejected by WhatsApp link preview).
    // If image is empty or points to a WebP logo, use the high-res 1200x630 og-familyhome.png banner.
    $ogDefaultImage = file_exists(public_path('images/og-familyhome.png'))
        ? asset('images/og-familyhome.png')
        : asset('icon.png');

    if (empty($image) || str_contains($image, 'icon.webp') || str_contains($image, 'logo_')) {
        $image = $ogDefaultImage;
    }

    $imageType = 'image/png';
    if (preg_match('/\.(jpe?g)$/i', $image)) {
        $imageType = 'image/jpeg';
    } elseif (preg_match('/\.webp$/i', $image)) {
        $imageType = 'image/webp';
    }

    $imageWidth = 1200;
    $imageHeight = 630;
    if (str_contains($image, 'icon.png')) {
        $imageWidth = 500;
        $imageHeight = 500;
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
@if(!empty($description))
<meta name="description" content="{{ $description }}" inertia head-key="description">
@endif
@if(!empty($keywords))
<meta name="keywords" content="{{ $keywords }}" inertia head-key="keywords">
@endif
<meta name="author" content="mohamed algebry" inertia head-key="author">
@if(!empty($meta['robots']))
<meta name="robots" content="{{ $meta['robots'] }}" inertia head-key="robots">
@endif
<link rel="canonical" href="{{ $canonical }}" inertia head-key="canonical">
@if(!empty($meta['geo_region']))
<meta name="geo.region" content="{{ $meta['geo_region'] }}" inertia head-key="geo.region">
@endif
@if(!empty($meta['geo_placename']))
<meta name="geo.placename" content="{{ $meta['geo_placename'] }}" inertia head-key="geo.placename">
@endif
@if(!empty($meta['geo_position']))
<meta name="geo.position" content="{{ $meta['geo_position'] }}" inertia head-key="geo.position">
@endif
@if(!empty($meta['icbm']))
<meta name="ICBM" content="{{ $meta['icbm'] }}" inertia head-key="ICBM">
@endif

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
<meta property="og:image:type" content="{{ $imageType }}" inertia head-key="og:image:type">
<meta property="og:image:width" content="{{ $imageWidth }}" inertia head-key="og:image:width">
<meta property="og:image:height" content="{{ $imageHeight }}" inertia head-key="og:image:height">
<meta property="og:image:alt" content="{{ $title }}" inertia head-key="og:image:alt">
<meta property="og:site_name" content="{{ config('app.name') }}" inertia head-key="og:site_name">
<link rel="image_src" href="{{ $image }}" inertia head-key="image_src">
<meta itemprop="image" content="{{ $image }}" inertia head-key="itemprop:image">

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
            <script type="application/ld+json" inertia head-key="jsonld-{{ $loop->index }}">
                {!! json_encode($s, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) !!}
            </script>
        @endforeach
    @else
        <script type="application/ld+json" inertia head-key="jsonld">
            {!! json_encode($schemas, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP) !!}
        </script>
    @endif
@endif
