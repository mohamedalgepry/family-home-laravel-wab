<?php

namespace App\Observers;

use App\Domain\Listings\Jobs\RegenerateSitemapJob;

class SitemapObserver
{
    private function triggerRegeneration(): void
    {
        if (app()->environment('testing') || app()->runningUnitTests()) {
            app(\App\Domain\Listings\Services\SitemapService::class)->regenerate();
        } else {
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
