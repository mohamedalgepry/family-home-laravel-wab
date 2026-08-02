<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ session('locale', app()->getLocale()) === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="google-site-verification" content="0KaNSaKJZ4bzZ34V2h1GSuFfSlyUMZVMujKj1F8iwE0" />

    <!-- Preload LCP Hero Image for Mobile & Desktop -->
    <link rel="preload" as="image" href="/images/hero-mobile.webp" type="image/webp" media="(max-width: 640px)" fetchpriority="high">
    <link rel="preload" as="image" href="/images/hero.webp" type="image/webp" media="(min-width: 641px)" fetchpriority="high">

    <!-- Cairo Font (Optimized & Non-blocking) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap"></noscript>

    <!-- Google Analytics (Deferred for maximum FCP performance) -->
    <script>
      window.addEventListener('load', function() {
        var s = document.createElement('script');
        s.src = "https://www.googletagmanager.com/gtag/js?id=G-43HZ7C3CK2";
        s.async = true;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-43HZ7C3CK2');
      });
    </script>

    @php
        $siteLogo = app(\App\Domain\Listings\Services\SettingsService::class)->get('site_logo');
        $faviconUrl = $siteLogo ? asset('storage/' . $siteLogo) : asset('icon.png');
        $seoService = app(\App\Services\SeoService::class);
        $currentMeta = $meta ?? $seoService->forPage(request()->route()?->getName() ?? 'home');
    @endphp

    <link rel="icon" type="image/png" href="{{ $faviconUrl }}">
    <link rel="apple-touch-icon" href="{{ $faviconUrl }}">

    <x-seo.meta :meta="$currentMeta" />

    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
</head>
<body class="font-cairo antialiased bg-gray-50 text-gray-900 selection:bg-primary-500 selection:text-white">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary-600 focus:text-white focus:outline-none shadow-lg rounded-b">
        {{ app()->getLocale() === 'ar' ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content' }}
    </a>
    @inertia
</body>
</html>
