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

    <!-- Preload Primary Cairo Font to eliminate font discovery delay & improve FCP -->
    <link rel="preload" href="/fonts/cairo/cairo-1.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/cairo/cairo-3.woff2" as="font" type="font/woff2" crossorigin>

    @if(request()->is('*units/*') || request()->is('*projects/*'))
    <!-- Preconnect to YouTube for embedded listing videos (only used on property detail pages) -->
    <link rel="preconnect" href="https://www.youtube.com" crossorigin>
    <link rel="preconnect" href="https://i.ytimg.com" crossorigin>
    <link rel="dns-prefetch" href="https://www.youtube.com">
    <link rel="dns-prefetch" href="https://i.ytimg.com">
    @endif

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

    {{-- Critical CSS to prevent FOUC when app.css is loaded asynchronously for better FCP --}}
    <style>
        body { font-family: 'Cairo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8F8F8; color: #1A1A1A; margin: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .bg-white { background-color: #ffffff; }
        .text-primary-900 { color: #CC0000; }
        .max-w-container { max-width: 1280px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
        header[role="banner"] { min-height: 64px; border-bottom: 1px solid #E4E4E4; background-color: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: space-between; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
        .skeleton { background: linear-gradient(90deg, #F5F5F5 25%, #E4E4E4 50%, #F5F5F5 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; border-radius: 8px; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    </style>

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
