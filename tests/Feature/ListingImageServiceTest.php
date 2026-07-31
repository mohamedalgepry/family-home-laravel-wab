<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\ListingImageService;
use App\Domain\Listings\Services\UnitService;
use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Queue::fake();

    $this->user = new User(['name' => 'Owner', 'email' => 'owner@test.com', 'password' => 'x']);
    $this->user->role = 'agent';
    $this->user->save();

    $this->unit = new Unit([
        'user_id' => $this->user->id,
        'type_id' => UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment'])->id,
        'area_id' => Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area'])->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Villa',
        'name_ar' => 'فيلا',
        'name_en' => 'Villa',
        'slug' => 'villa',
    ]);
    $this->unit->save();

    $this->imageService = app(ListingImageService::class);
});

it('persists images with incremental sort order and queues thumbnails', function () {
    $paths = ['units/2026/01/a.jpg', 'units/2026/01/b.jpg'];

    $this->imageService->persistImages($this->unit, $paths);

    $images = $this->unit->images()->orderBy('sort_order')->get();

    expect($images)->toHaveCount(2)
        ->and($images[0]->path)->toBe($paths[0])
        ->and($images[0]->sort_order)->toBe(1)
        ->and($images[1]->path)->toBe($paths[1])
        ->and($images[1]->sort_order)->toBe(2)
        ->and($images[0]->is_primary)->toBeFalse()
        ->and($images[1]->is_primary)->toBeFalse();

    Queue::assertPushed(GenerateThumbnailsJob::class, fn ($job) => $job->modelType === Unit::class && $job->paths === $paths);
});

it('marks only the selected image as primary', function () {
    $paths = ['units/2026/01/a.jpg', 'units/2026/01/b.jpg'];

    $this->imageService->persistImages($this->unit, $paths, primaryIndex: 1);

    $images = $this->unit->images()->orderBy('sort_order')->get();

    expect($images[0]->is_primary)->toBeFalse()
        ->and($images[1]->is_primary)->toBeTrue();
});

it('does not override an existing primary image', function () {
    $this->imageService->persistImages($this->unit, ['units/2026/01/a.jpg'], primaryIndex: 0);

    $this->imageService->persistImages($this->unit, ['units/2026/01/b.jpg'], primaryIndex: 0);

    $images = $this->unit->images()->orderBy('sort_order')->get();

    expect($images)->toHaveCount(2)
        ->and($images[0]->is_primary)->toBeTrue()
        ->and($images[1]->is_primary)->toBeFalse();
});

it('supports per-index attributes through a callable', function () {
    $article = App\Domain\Listings\Models\Article::create([
        'category_id' => App\Domain\Listings\Models\Category::create(['name_ar' => 'أخبار', 'name_en' => 'News', 'slug' => 'news'])->id,
        'title' => 'Article',
        'title_ar' => 'مقال',
        'title_en' => 'Article',
        'slug' => 'article',
        'content' => 'Content',
    ]);

    $paths = ['articles/2026/01/a.jpg', 'articles/2026/01/b.jpg'];

    $this->imageService->persistImages($article, $paths, fn ($index) => [
        'alt_text' => "Alt {$index}",
        'position' => $index === 0 ? 'header' : 'middle',
    ]);

    $images = $article->images()->orderBy('sort_order')->get();

    expect($images[0]->alt_text)->toBe('Alt 0')
        ->and($images[0]->position)->toBe('header')
        ->and($images[1]->alt_text)->toBe('Alt 1')
        ->and($images[1]->position)->toBe('middle');
});

it('deletes the original and thumbnail files', function () {
    $original = 'units/2026/01/photo.jpg';
    $thumb = 'units/2026/01/thumb_photo.jpg';

    Storage::disk('public')->put($original, 'data');
    Storage::disk('public')->put($thumb, 'data');

    $this->imageService->deleteImageFiles([$original, null]);

    expect(Storage::disk('public')->exists($original))->toBeFalse()
        ->and(Storage::disk('public')->exists($thumb))->toBeFalse();
});

it('persists and deletes images through the unit service flow', function () {
    $paths = ['units/2026/01/a.jpg', 'units/2026/01/thumb_a.jpg'];
    foreach ($paths as $path) {
        Storage::disk('public')->put($path, 'data');
    }

    $service = app(UnitService::class);
    $service->createUnit(
        data: \App\Domain\Listings\DTOs\CreateUnitData::from([
            'name_en' => 'New Unit',
            'type_id' => $this->unit->type_id,
            'area_id' => $this->unit->area_id,
            'transaction' => 'sale',
            'price' => 500,
        ]),
        user: $this->user,
        imagePaths: ['units/2026/01/a.jpg'],
        primaryImageIndex: 0,
    );

    $created = Unit::where('name_en', 'New Unit')->first();

    expect($created->images()->count())->toBe(1)
        ->and($created->images()->first()->is_primary)->toBeTrue();

    $service->deleteUnit($created->id);

    expect(Storage::disk('public')->exists('units/2026/01/a.jpg'))->toBeFalse()
        ->and(Storage::disk('public')->exists('units/2026/01/thumb_a.jpg'))->toBeFalse();
});
