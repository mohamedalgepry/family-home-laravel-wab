<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\PageSeo;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PageSeoController extends Controller
{
    private const CORE_PAGES = [
        'home',
        'units_index',
        'projects_index',
        'deals',
        'articles_index',
        'about',
        'contact',
        'comparison',
    ];

    public function index(): Response
    {
        $this->authorize('update', PageSeo::class);

        foreach (self::CORE_PAGES as $key) {
            PageSeo::firstOrCreate(['page_key' => $key]);
        }

        $pages = PageSeo::orderBy('page_key')->get();

        return Inertia::render('Admin/SeoPages/Index', [
            'pages' => $pages,
        ]);
    }

    public function update(Request $request, PageSeo $pageSeo): RedirectResponse
    {
        $this->authorize('update', PageSeo::class);

        $validated = $request->validate([
            'meta_title_ar' => 'nullable|string|max:255',
            'meta_title_en' => 'nullable|string|max:255',
            'meta_description_ar' => 'nullable|string|max:1000',
            'meta_description_en' => 'nullable|string|max:1000',
            'meta_keywords_ar' => 'nullable|array',
            'meta_keywords_ar.*' => 'string|max:100',
            'meta_keywords_en' => 'nullable|array',
            'meta_keywords_en.*' => 'string|max:100',
        ]);

        $pageSeo->update($validated);
        Cache::forget('seo_pages_cache');

        return redirect()->route('admin.seo-pages.index')
            ->with('success', __('SEO settings updated successfully.'));
    }
}
