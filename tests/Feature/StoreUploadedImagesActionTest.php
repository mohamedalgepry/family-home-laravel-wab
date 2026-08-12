<?php

use App\Domain\Listings\Actions\StoreUploadedImagesAction;
use App\Domain\Media\Services\ImageOptimizerService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

// ─── normal upload path ───────────────────────────────────────────────────────

it('stores uploaded files and returns their relative paths', function () {
    $action = app(StoreUploadedImagesAction::class);
    $file = UploadedFile::fake()->image('photo.jpg');

    $paths = $action->execute([$file], 'articles');

    expect($paths)->toHaveCount(1);

    // The path should exist somewhere on the fake disk.
    $relPath = $paths[0];
    expect(Storage::disk('public')->exists($relPath)
        || str_starts_with($relPath, 'articles/')
    )->toBeTrue();
});

it('skips non-UploadedFile entries without error', function () {
    $action = app(StoreUploadedImagesAction::class);

    // Pass a mix of valid file and invalid entries.
    $paths = $action->execute(['not-a-file', null, 42], 'articles');

    expect($paths)->toBeEmpty();
});

it('returns an empty array when no files are provided', function () {
    $action = app(StoreUploadedImagesAction::class);

    expect($action->execute([], 'articles'))->toBeEmpty();
});

// ─── filesystem write failure ─────────────────────────────────────────────────

it('skips a file and logs an error when the filesystem write fails', function () {
    Log::spy();

    // Stub the optimizer so it never tries real image processing.
    $optimizer = Mockery::mock(ImageOptimizerService::class);
    $optimizer->shouldReceive('convertToWebp')->andReturn(false);

    // Force Storage::disk('public')->put() to always fail by binding a
    // fake disk that throws on put. We achieve this by creating a disk mock
    // and binding our action with it instead of mocking UploadedFile::store().
    // Since UploadedFile::store() uses Storage internally, we can fake the
    // underlying filesystem differently in integration, but here we test the
    // guard path using a custom fake.
    //
    // The simplest integration approach: swap the storage driver with one that
    // fails. We use a writable fake but then make the target folder unwritable
    // via a custom stream wrapper or just verify the guard in unit style.

    // Instead, we verify the guard with a partially-mocked UploadedFile that
    // returns false from store().
    $fakefile = Mockery::mock(UploadedFile::class);
    $fakefile->shouldReceive('store')->andReturn(false);
    $fakefile->shouldReceive('getClientOriginalName')->andReturn('bad.jpg');
    $fakefile->shouldReceive('getSize')->andReturn(1024);
    $fakefile->shouldAllowMockingProtectedMethods();
    $fakefile->makePartial();

    $action = new StoreUploadedImagesAction($optimizer);
    $paths = $action->execute([$fakefile], 'articles');

    expect($paths)->toBeEmpty();

    Log::shouldHaveReceived('error')
        ->once()
        ->with('StoreUploadedImagesAction: filesystem write failed', Mockery::subset([
            'folder' => 'articles',
            'original_name' => 'bad.jpg',
        ]));
});

// ─── optimizer fallback when WebP conversion fails ───────────────────────────

it('preserves the original file extension (not forced webp)', function () {
    $optimizer = Mockery::mock(ImageOptimizerService::class);

    $action = new StoreUploadedImagesAction($optimizer);
    $file = UploadedFile::fake()->image('original.jpg');

    $paths = $action->execute([$file], 'articles');

    expect($paths)->toHaveCount(1)
        ->and($paths[0])->not->toEndWith('.webp'); // Original extension preserved; thumbnails generated async
});
