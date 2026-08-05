@props(['meta' => []])

@php
    $defaultTitle = config('app.name');
    $title = $meta['title'] ?? $defaultTitle;
    $description = $meta['description'] ?? '';
    $keywords = $meta['keywords'] ?? '';
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
        $image = $siteLogo ? asset('storage/' . ltrim($siteLogo, '/')) : asset('icon.png');
    }

    $canonical = $meta['canonical'] ?? url()->current();
    $hreflang = $meta['hreflang'] ?? [];
    $ogType = $meta['og_type'] ?? 'website';
    $schemas = $meta['schema'] ?? [];
@endphp

<title>{{ $title }}</title>
<meta name="description" content="{{ $description }}">
<meta name="author" content="mohamed algbry">
@if($keywords)
    <meta name="keywords" content="{{ $keywords }}">
@endif
<link rel="canonical" href="{{ $canonical }}">

@foreach($hreflang as $lang => $url)
    <link rel="alternate" hreflang="{{ $lang }}" href="{{ $url }}">
@endforeach

<!-- Open Graph / WhatsApp / Facebook / Telegram / LinkedIn -->
<meta property="og:type" content="{{ $ogType }}">
<meta property="og:url" content="{{ $canonical }}">
<meta property="og:title" content="{{ $title }}">
<meta property="og:description" content="{{ $description }}">
<meta property="og:image" content="{{ $image }}">
<meta property="og:image:secure_url" content="{{ $image }}">
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
