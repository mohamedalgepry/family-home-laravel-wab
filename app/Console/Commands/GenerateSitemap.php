<?php

namespace App\Console\Commands;

use App\Domain\Listings\Services\SitemapService;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    protected $description = 'Generate public sitemap index, sub-sitemaps, and robots.txt';

    public function handle(SitemapService $sitemapService): int
    {
        $sitemapService->forgetCache();
        $sitemapService->writePublicFiles();

        $this->info('Public sitemap index, sub-sitemaps, and robots.txt generated successfully.');

        return Command::SUCCESS;
    }
}
