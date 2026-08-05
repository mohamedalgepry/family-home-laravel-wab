<?php

namespace App\Observers;

use App\Domain\Listings\Services\SitemapService;

class SitemapObserver
{
    private function triggerRegeneration(): void
    {
        app(SitemapService::class)->regenerate();
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
