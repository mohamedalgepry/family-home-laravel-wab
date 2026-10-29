<?php

namespace Tests;

use App\Domain\Listings\Jobs\RegeneratePrerenderJob;
use Illuminate\Support\Facades\Queue;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Prerendering is a production side effect and runs a Node/SSR server.
        // Fake only that job so model-observer activity cannot launch a full site
        // prerender on every test commit; keep sitemap regeneration and other jobs real.
        Queue::fake([RegeneratePrerenderJob::class]);

        // Disable CSRF verification for all feature tests.
        // This prevents 419 responses when posting without a real session token.
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class);

        if (\Illuminate\Support\Facades\DB::connection() instanceof \Illuminate\Database\SQLiteConnection) {
            $pdo = \Illuminate\Support\Facades\DB::connection()->getPdo();
            if (method_exists($pdo, 'sqliteCreateFunction')) {
                $pdo->sqliteCreateFunction('GREATEST', fn (...$args) => max($args));
                $pdo->sqliteCreateFunction('LEAST', fn (...$args) => min($args));
            }
        }
    }
}
