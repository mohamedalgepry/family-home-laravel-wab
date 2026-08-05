<?php

namespace App\Http\Controllers\Public;

use App\Domain\Listings\Services\SitemapBuilder;
use App\Domain\Listings\Services\SitemapService;
use Illuminate\Http\Response;

class SitemapController
{
    public function __construct(
        private readonly SitemapService $sitemapService,
        private readonly SitemapBuilder $builder,
    ) {}

    public function __invoke(): Response
    {
        return $this->index();
    }

    public function index(): Response
    {
        return $this->xmlResponse(
            $this->sitemapService->remember('sitemap_index_xml', fn () => $this->builder->buildIndex())
        );
    }

    public function static(): Response
    {
        return $this->xmlResponse(
            $this->sitemapService->remember('sitemap_static_xml', fn () => $this->builder->buildStatic())
        );
    }

    public function units(): Response
    {
        return $this->xmlResponse(
            $this->sitemapService->remember('sitemap_units_xml', fn () => $this->builder->buildUnits())
        );
    }

    public function projects(): Response
    {
        return $this->xmlResponse(
            $this->sitemapService->remember('sitemap_projects_xml', fn () => $this->builder->buildProjects())
        );
    }

    public function articles(): Response
    {
        return $this->xmlResponse(
            $this->sitemapService->remember('sitemap_articles_xml', fn () => $this->builder->buildArticles())
        );
    }

    public function categories(): Response
    {
        return $this->xmlResponse(
            $this->sitemapService->remember('sitemap_categories_xml', fn () => $this->builder->buildCategories())
        );
    }

    public function robots(): Response
    {
        return response($this->builder->buildRobots(), 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }

    private function xmlResponse(string $content): Response
    {
        return response($content, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
