<?php

namespace App\Observers;

use App\Domain\Listings\Jobs\RegenerateSitemapJob;

class SitemapObserver
{
    private function triggerRegeneration(): void
    {
        dispatch(new RegenerateSitemapJob)->afterCommit();
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
