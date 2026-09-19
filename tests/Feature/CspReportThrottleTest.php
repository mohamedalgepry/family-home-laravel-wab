<?php

use Illuminate\Support\Facades\RateLimiter;

/**
 * The unauthenticated /csp-report endpoint writes to the log on every hit.
 * Without throttling, anyone could flood the logs (disk-fill DoS).
 */
it('accepts csp violation reports', function () {
    RateLimiter::clear('csp-report:127.0.0.1');

    $response = $this->postJson('/csp-report', [
        'csp-report' => ['document-uri' => 'https://example.com', 'violated-directive' => 'img-src'],
    ]);

    $response->assertNoContent();
});

it('throttles excessive csp violation reports', function () {
    $statuses = [];

    for ($i = 0; $i < 12; $i++) {
        $statuses[] = $this->postJson('/csp-report', [
            'csp-report' => ['violated-directive' => 'img-src'],
        ])->getStatusCode();
    }

    expect($statuses)->toContain(429);

    // The first request must always succeed
    expect($statuses[0])->toBe(204);
});
