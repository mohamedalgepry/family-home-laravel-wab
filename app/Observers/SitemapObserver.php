<?php

namespace App\Observers;

use App\Domain\Listings\Jobs\RegenerateSitemapJob;

class SitemapObserver
{
    private function triggerRegeneration(): void
    {
        try {
            app(\App\Domain\Listings\Services\SitemapService::class)->regenerate();
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Direct sitemap regeneration failed in observer, dispatching job fallback: ' . $e->getMessage());
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
