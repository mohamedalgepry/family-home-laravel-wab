<?php

namespace App\Http\Controllers\Public;

use App\Domain\Common\Support\Sanitizer;
use App\Domain\Listings\Models\AboutPage;
use App\Http\Controllers\Controller;
use App\Services\SeoService;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;

class PageController extends Controller
{
    public function switchLocale(string $lang)
    {
        if (! in_array($lang, ['ar', 'en'])) {
            abort(404);
        }

        session(['locale' => $lang]);
        App::setLocale($lang);

        $targetPath = request()->query('path');
        if ($targetPath && str_starts_with($targetPath, '/') && ! str_starts_with($targetPath, '//')) {
            if (preg_match('#^/(ar|en)(/.*)?$#', $targetPath, $matches)) {
                $rest = $matches[2] ?? '';

                return redirect('/'.$lang.$rest);
            }

            return redirect($targetPath);
        }

        $previous = url()->previous();
        if ($previous) {
            $parsed = parse_url($previous);
            $path = $parsed['path'] ?? '';
            $query = isset($parsed['query']) ? '?'.$parsed['query'] : '';

            if ($path && preg_match('#^/(ar|en)(/.*)?$#', $path, $matches)) {
                $rest = $matches[2] ?? '';

                return redirect('/'.$lang.$rest.$query);
            }

            if ($path && str_starts_with($path, '/')) {
                return redirect($path.$query);
            }
        }

        return redirect()->route('home', ['locale' => $lang]);
    }

    public function rootRedirect()
    {
        $locale = session('locale', 'ar');
        if (! in_array($locale, ['ar', 'en'])) {
            $locale = 'ar';
        }

        // 301 دائم للواحة الحفانية باللغة لمنع المشعّبات والجزء من الـ SEO
        return redirect()->route('home', ['locale' => $locale], 301);
    }

    public function about()
    {
        $about = AboutPage::first();

        if ($about) {
            $about->content_ar = Sanitizer::rich($about->content_ar ?? '');
            $about->content_en = Sanitizer::rich($about->content_en ?? '');
        }

        $meta = app(SeoService::class)->forPage('about');

        return Inertia::render('Public/About', [
            'page' => $about,
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta]);
    }

    public function contact()
    {
        $meta = app(SeoService::class)->forPage('contact');

        return Inertia::render('Public/Contact', [
            'seo_meta' => $meta,
        ])->withViewData(['meta' => $meta]);
    }
}
