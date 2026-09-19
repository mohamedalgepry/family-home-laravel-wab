<?php

namespace App\Observers;

use App\Domain\Listings\Jobs\RegenerateSitemapJob;
use App\Domain\Listings\Services\SitemapService;
use Illuminate\Support\Facades\Log;

class SitemapObserver
{
    private function triggerRegeneration(): void
    {
        try {
            app(SitemapService::class)->regenerate();
        } catch (\Throwable $e) {
            Log::warning('Direct sitemap regeneration failed in observer, dispatching job fallback: '.$e->getMessage());
            dispatch(new RegenerateSitemapJob)->afterCommit();
        }
    }

    public function saved($model): void
    {
        $this->triggerRegeneration();
    }

    public function deleted($model): void
    {
        $this->triggerRegeneration();
    }

    public function restored($model): void
    {
        $this->triggerRegeneration();
    }

    public function forceDeleted($model): void
    {
        $this->triggerRegeneration();
    }
}
