<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ session('locale', 'en') === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="google-site-verification" content="0KaNSaKJZ4bzZ34V2h1GSuFfSlyUMZVMujKj1F8iwE0" />

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-43HZ7C3CK2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-43HZ7C3CK2');
    </script>
    @php
        $siteLogo = app(\App\Domain\Listings\Services\SettingsService::class)->get('site_logo');
        $faviconUrl = $siteLogo ? asset('storage/' . $siteLogo) : asset('icon.png');
    @endphp
    <link rel="icon" type="image/png" href="{{ $faviconUrl }}">
    <link rel="apple-touch-icon" href="{{ $faviconUrl }}">
    @php
        $defaultTitle = request()->is('admin*')
            ? __('common.admin_panel') . ' — ' . __('common.app_name')
            : __('common.app_name');
    @endphp
    @if(isset($meta))
        @if(isset($meta['canonical']))
            <link rel="canonical" href="{{ $meta['canonical'] }}">
        @endif
        @if(isset($meta['hreflang']))
            @foreach($meta['hreflang'] as $lang => $url)
                <link rel="alternate" hreflang="{{ $lang }}" href="{{ $url }}">
            @endforeach
        @endif
        <title>{{ $meta['title'] ?? $defaultTitle }}</title>
        <meta name="description" content="{{ $meta['description'] ?? '' }}">
        <meta property="og:title" content="{{ $meta['title'] ?? $defaultTitle }}">
        <meta property="og:description" content="{{ $meta['description'] ?? '' }}">
        @if(isset($meta['image']))
            <meta property="og:image" content="{{ asset('storage/' . $meta['image']) }}">
            <meta name="twitter:image" content="{{ asset('storage/' . $meta['image']) }}">
        @else
            <meta property="og:image" content="{{ $faviconUrl }}">
            <meta name="twitter:image" content="{{ $faviconUrl }}">
        @endif
        @if(isset($meta['schema']))
            <script type="application/ld+json">{{ json_encode($meta['schema'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) }}</script>
        @endif
    @else
        <title>{{ $defaultTitle }}</title>
        <meta property="og:image" content="{{ $faviconUrl }}">
        <meta name="twitter:image" content="{{ $faviconUrl }}">
    @endif
    <meta property="og:image:width" content="512">
    <meta property="og:image:height" content="512">
    <meta name="twitter:card" content="summary_large_image">
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
