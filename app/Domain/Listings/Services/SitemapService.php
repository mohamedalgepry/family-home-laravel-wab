<?php

namespace App\Domain\Listings\Services;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

class SitemapService
{
    /** Invalidate the dynamic response and queue a fresh public sitemap. */
    public function regenerate(): void
    {
        try {
            Cache::forget('sitemap_xml');
            Artisan::queue('sitemap:generate');
        } catch (\Throwable) {
            // The hourly scheduler is a fallback when the queue is unavailable.
        }
    }
}
