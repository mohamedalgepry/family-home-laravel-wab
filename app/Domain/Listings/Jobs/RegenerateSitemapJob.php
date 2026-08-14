<?php

namespace App\Domain\Listings\Jobs;

use App\Domain\Listings\Services\SitemapService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RegenerateSitemapJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 60;

    public function handle(SitemapService $sitemapService): void
    {
        Log::info('RegenerateSitemapJob: starting regeneration');
        $sitemapService->regenerate();
    }
}
