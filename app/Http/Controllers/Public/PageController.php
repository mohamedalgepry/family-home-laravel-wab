<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Models\AboutPage;
use App\Domain\Common\Support\Sanitizer;
use App\Http\Controllers\Controller;
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

        $previous = url()->previous();
        $parsed = parse_url($previous);
        $path = $parsed['path'] ?? '/';
        $query = isset($parsed['query']) ? '?'.$parsed['query'] : '';

        if (preg_match('#^/(ar|en)(/.*)?$#', $path, $matches)) {
            $rest = $matches[2] ?? '';
            $newPath = '/'.$lang.$rest;

            return redirect($newPath.$query);
        }

        return redirect()->back();
    }

    public function rootRedirect()
    {
        return redirect('/'.session('locale', 'ar'));
    }

    public function about()
    {
        $about = AboutPage::first();

        if ($about) {
            $about->content_ar = Sanitizer::rich($about->content_ar ?? '');
            $about->content_en = Sanitizer::rich($about->content_en ?? '');
        }

        return Inertia::render('Public/About', [
            'page' => $about,
        ]);
    }

    public function contact()
    {
        return Inertia::render('Public/Contact');
    }
}
