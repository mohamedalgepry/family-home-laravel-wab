<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ session('locale', app()->getLocale()) === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="google-site-verification" content="0KaNSaKJZ4bzZ34V2h1GSuFfSlyUMZVMujKj1F8iwE0" />

    @php
        $settingsService = app(\App\Domain\Listings\Services\SettingsService::class);
        $heroImageSetting = $settingsService->get('hero_image');
        $heroImageMobileSetting = $settingsService->get('hero_image_mobile');
        $heroDesktopUrl = $heroImageSetting ? ('/storage/' . ltrim($heroImageSetting, '/')) : '/images/hero.webp';
        $heroMobileUrl = $heroImageMobileSetting ? ('/storage/' . ltrim($heroImageMobileSetting, '/')) : ($heroImageSetting ? ('/storage/' . ltrim($heroImageSetting, '/')) : '/images/hero-mobile.webp');
    @endphp

    @if(isset($lcpImage))
    <!-- Preload LCP Image (Dynamic from Controller) -->
    <link rel="preload" as="image" href="{{ $lcpImage }}" fetchpriority="high">
    @elseif(!empty($seo_meta['image']) && !str_contains($seo_meta['image'], 'icon.webp') && !str_contains($seo_meta['image'], 'site_logo'))
    <!-- Preload Entity Featured Cover Image for Instant LCP Discovery -->
    <link rel="preload" as="image" href="{{ str_starts_with($seo_meta['image'], 'http') ? $seo_meta['image'] : asset(ltrim($seo_meta['image'], '/')) }}" fetchpriority="high">
    @elseif(request()->routeIs('home') || request()->is('/') || request()->is('ar') || request()->is('en'))
    <!-- Preload LCP Hero Image for Mobile & Desktop (Home Page Only) -->
    <link rel="preload" as="image" href="{{ $heroMobileUrl }}" type="image/webp" media="(max-width: 640px)" fetchpriority="high">
    <link rel="preload" as="image" href="{{ $heroDesktopUrl }}" type="image/webp" media="(min-width: 641px)" fetchpriority="high">
    @endif

    <!-- Preconnect to YouTube for embedded listing videos (only used when a page has a video) -->
    <link rel="preconnect" href="https://www.youtube.com" crossorigin>
    <link rel="preconnect" href="https://i.ytimg.com" crossorigin>
    <link rel="dns-prefetch" href="https://www.youtube.com">
    <link rel="dns-prefetch" href="https://i.ytimg.com">

    <!-- Google Analytics (Deferred to user interaction & idle to eliminate Unused JS & TBT in PageSpeed/Lighthouse) -->
    <script>
      (function() {
        var loaded = false;
        function loadGA() {
          if (loaded) return;
          loaded = true;
          var s = document.createElement('script');
          s.src = "https://www.googletagmanager.com/gtag/js?id=G-43HZ7C3CK2";
          s.async = true;
          document.head.appendChild(s);
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-43HZ7C3CK2');
          ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'].forEach(function(e) {
            window.removeEventListener(e, loadGA, { passive: true });
          });
        }
        ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'].forEach(function(e) {
          window.addEventListener(e, loadGA, { passive: true });
        });
        if ('requestIdleCallback' in window) {
          requestIdleCallback(function() { setTimeout(loadGA, 5000); });
        } else {
          setTimeout(loadGA, 6000);
        }
      })();
    </script>

    @php
        $siteLogo = app(\App\Domain\Listings\Services\SettingsService::class)->get('site_logo');
        $faviconUrl = $siteLogo ? asset('storage/' . $siteLogo) : asset('icon.png');
        $seoService = app(\App\Services\SeoService::class);
        $currentMeta = $meta ?? $seoService->forPage(request()->route()?->getName() ?? 'home');
    @endphp

    <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ $faviconUrl }}">
    <link rel="apple-touch-icon" href="{{ $faviconUrl }}">
    <link rel="manifest" href="/site.webmanifest">

    {{-- Canonical SEO source for the initial HTML (bots, link unfurlers, no-JS crawlers).
         React <SeoHead> owns client-side navigation updates; SSR must stay disabled so
         @inertiaHead never duplicates these tags. --}}
    <x-seo.meta :meta="$currentMeta" />

    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @php
        $localeChunk = null;
        $manifestPath = public_path('build/manifest.json');
        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $localeKey = app()->getLocale() === 'ar'
                ? 'resources/js/Utils/locales/ar.js'
                : 'resources/js/Utils/locales/en.js';
            $localeChunk = $manifest[$localeKey]['file'] ?? null;
        }
    @endphp
    @if($localeChunk)
    <!-- Preload the active locale dictionary (code-split per language) -->
    <link rel="modulepreload" as="script" href="{{ asset('build/' . $localeChunk) }}">
    @endif
    @inertiaHead
</head>
<body class="font-cairo antialiased bg-gray-50 text-gray-900 selection:bg-primary-500 selection:text-white">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary-600 focus:text-white focus:outline-none shadow-lg rounded-b">
        {{ app()->getLocale() === 'ar' ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content' }}
    </a>
    @inertia
</body>
</html>
