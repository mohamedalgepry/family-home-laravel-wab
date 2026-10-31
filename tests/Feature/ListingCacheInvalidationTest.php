<?php

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Services\ListingService;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;

it('increments the listing cache version when a unit is created, updated and deleted', function () {
    $versionKey = ListingService::CACHE_VERSION_KEY;
    Cache::forever($versionKey, 10);

    $unit = createTestUnit(['price' => 1000]);
    expect(Cache::get($versionKey))->toBe(11);

    $unit->update(['price' => 2000]);
    expect(Cache::get($versionKey))->toBe(12);

    $unit->delete();
    expect(Cache::get($versionKey))->toBe(13);
});

it('increments the listing cache version when a project is created, updated and deleted', function () {
    $versionKey = ListingService::CACHE_VERSION_KEY;
    Cache::forever($versionKey, 20);

    $user = createUser('Cache Project Owner', 'admin');

    $project = Project::create([
        'user_id' => $user->id,
        'name' => 'Cache Project',
        'name_ar' => 'مشروع الكاش',
        'name_en' => 'Cache Project',
        'slug' => 'cache-project-'.uniqid(),
        'slug_ar' => 'مشروع-الكاش-'.uniqid(),
        'slug_en' => 'cache-project-'.uniqid(),
    ]);
    expect(Cache::get($versionKey))->toBe(21);

    $project->update(['name_en' => 'Cache Project Updated']);
    expect(Cache::get($versionKey))->toBe(22);

    $project->delete();
    expect(Cache::get($versionKey))->toBe(23);
});

it('serves the updated unit price on the home page immediately after saving', function () {
    $unit = createTestUnit(['price' => 1500000, 'is_active' => true]);

    $this->get('/ar')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->has('latestUnits.data', 1)
            ->where('latestUnits.data.0.id', $unit->id)
            ->where('latestUnits.data.0.price', '1500000.00'));

    $versionBeforeUpdate = Cache::get(ListingService::CACHE_VERSION_KEY);

    $unit->update(['price' => 2750000]);

    expect(Cache::get(ListingService::CACHE_VERSION_KEY))->not->toBe($versionBeforeUpdate);

    // Same page, same URL: the new version key must bypass the previously cached payload.
    $this->get('/ar')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->has('latestUnits.data', 1)
            ->where('latestUnits.data.0.id', $unit->id)
            ->where('latestUnits.data.0.price', '2750000.00'));
});

it('purges the settings cache when a setting row is saved directly', function () {
    Cache::forever('settings_all', ['site_name' => 'Old Name']);

    Setting::create(['key' => 'site_name_'.uniqid(), 'value' => 'New Name']);

    expect(Cache::has('settings_all'))->toBeFalse();
});
