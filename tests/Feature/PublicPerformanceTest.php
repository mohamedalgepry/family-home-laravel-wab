<?php

use App\Domain\Listings\Models\Unit;
use Illuminate\Support\Facades\DB;

use function Pest\Laravel\get;

/**
 * Performance regression guards for public pages:
 * - query budgets so N+1 regressions fail CI instead of reaching production
 * - prefetch requests must not count as views
 * - view counting must not churn updated_at (sitemap lastmod / cache keys)
 */
beforeEach(function () {
    $this->units = collect(range(1, 15))->map(fn ($i) => createTestUnit([
        'is_active' => true,
        'price' => 1_000_000 + $i,
    ]));
});

it('renders the units listing within the query budget', function () {
    get('/ar/units')->assertOk(); // warm settings/lookup caches

    DB::enableQueryLog();
    get('/ar/units')->assertOk();
    $count = count(DB::getQueryLog());
    DB::disableQueryLog();

    // Listing page with 15 units: paginate count + rows + eager loads.
    // A regression to lazy loading would push this above 12 immediately.
    expect($count)->toBeLessThanOrEqual(12, "units index ran {$count} queries — possible N+1 regression");
});

it('renders the unit detail page within the query budget', function () {
    $unit = $this->units->first();
    get('/ar/units/'.$unit->slug)->assertOk(); // warm caches

    DB::enableQueryLog();
    get('/ar/units/'.$unit->slug)->assertOk();
    $count = count(DB::getQueryLog());
    DB::disableQueryLog();

    expect($count)->toBeLessThanOrEqual(25, "unit show ran {$count} queries — possible N+1 regression");
});

it('does not count Inertia prefetch requests as page views', function () {
    $unit = $this->units->first();
    $before = $unit->fresh()->views_count;

    get('/ar/units/'.$unit->slug, ['Purpose' => 'prefetch'])->assertOk();
    get('/ar/units/'.$unit->slug, ['Sec-Purpose' => 'prefetch;anonymous-client-ip'])->assertOk();

    expect(DB::table('page_views')
        ->where('viewable_type', Unit::class)
        ->where('viewable_id', $unit->id)
        ->count()
    )->toBe(0)
        ->and($unit->fresh()->views_count)->toBe($before);
});

it('counts a real visit exactly once and keeps updated_at untouched', function () {
    $unit = $this->units->first();
    $originalUpdatedAt = $unit->fresh()->updated_at;

    $this->travel(1)->days();

    get('/ar/units/'.$unit->slug)->assertOk();

    $fresh = $unit->fresh();

    expect(DB::table('page_views')
        ->where('viewable_type', Unit::class)
        ->where('viewable_id', $unit->id)
        ->count()
    )->toBe(1)
        ->and($fresh->views_count)->toBe(1)
        ->and($fresh->updated_at->toDateTimeString())->toBe($originalUpdatedAt->toDateTimeString());
});

it('keeps public listing payloads reasonably small', function () {
    $response = get('/ar/units');

    $response->assertOk();

    // 15 units + layout props should stay well under 400KB of HTML.
    // A leak of heavy fields (full descriptions, admin data) would inflate this.
    expect(strlen($response->getContent()))->toBeLessThan(400 * 1024);
});
