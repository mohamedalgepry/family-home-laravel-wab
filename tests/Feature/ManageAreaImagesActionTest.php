<?php

use App\Domain\Listings\Actions\ManageAreaImagesAction;
use App\Domain\Listings\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function fakeAreaImage(string $name)
{
    return UploadedFile::fake()->image($name, 1200, 800);
}

function areaImageUploadRequest(array $files): Request
{
    return Request::create('/admin/areas', 'POST', [], [], $files);
}

function makeArea(array $attributes = []): Area
{
    return Area::create(array_merge([
        'name_ar' => 'منطقة صور '.uniqid(),
        'name_en' => 'Images Area '.uniqid(),
        'slug' => 'images-area-'.uniqid(),
    ], $attributes));
}

it('stores card, hero and gallery uploads under dated folders on create', function () {
    Storage::fake('public');

    $request = areaImageUploadRequest([
        'image_path' => fakeAreaImage('card.jpg'),
        'hero_image' => fakeAreaImage('hero.jpg'),
        'gallery' => [fakeAreaImage('g1.jpg'), fakeAreaImage('g2.jpg')],
    ]);

    $result = app(ManageAreaImagesAction::class)->forCreate($request, ['name_en' => 'Area']);

    expect($result['validated']['image_path'])->toStartWith('areas/cards/')
        ->and($result['validated']['hero_image'])->toStartWith('areas/hero/')
        ->and($result['validated']['gallery'])->toHaveCount(2)
        ->and($result['uploaded'])->toHaveCount(4);

    Storage::disk('public')->assertExists($result['validated']['image_path']);
    Storage::disk('public')->assertExists($result['validated']['hero_image']);
    foreach ($result['validated']['gallery'] as $path) {
        Storage::disk('public')->assertExists($path);
    }
});

it('replaces an existing image and deletes the previous file on update', function () {
    Storage::fake('public');

    $area = makeArea();
    $oldPath = 'areas/cards/2025/01/old.jpg';
    Storage::disk('public')->put($oldPath, 'old-bytes');
    $area->forceFill(['image_path' => $oldPath])->save();

    $request = areaImageUploadRequest(['image_path' => fakeAreaImage('new.jpg')]);

    $result = app(ManageAreaImagesAction::class)->forUpdate($request, $area->fresh(), ['image_path' => null]);

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($result['validated']['image_path']);
    expect($result['uploaded'])->toHaveCount(1);
});

it('clears an image when the payload explicitly sends null', function () {
    Storage::fake('public');

    $area = makeArea();
    $oldPath = 'areas/hero/2025/01/hero.jpg';
    Storage::disk('public')->put($oldPath, 'old-bytes');
    $area->forceFill(['hero_image' => $oldPath])->save();

    $request = areaImageUploadRequest([]);

    $result = app(ManageAreaImagesAction::class)->forUpdate($request, $area->fresh(), ['hero_image' => null]);

    Storage::disk('public')->assertMissing($oldPath);
    expect($result['validated']['hero_image'])->toBeNull();
});

it('deletes every stored image of the area, including the gallery', function () {
    Storage::fake('public');

    $card = 'areas/cards/2025/01/card.jpg';
    $hero = 'areas/hero/2025/01/hero.jpg';
    $gallery = ['areas/gallery/2025/01/g1.jpg', 'areas/gallery/2025/01/g2.jpg'];

    $area = makeArea();
    $area->forceFill([
        'image_path' => $card,
        'hero_image' => $hero,
        'gallery' => $gallery,
    ])->save();

    foreach (array_merge([$card, $hero], $gallery) as $path) {
        Storage::disk('public')->put($path, 'bytes');
    }

    app(ManageAreaImagesAction::class)->deleteAllFor($area->fresh());

    foreach (array_merge([$card, $hero], $gallery) as $path) {
        Storage::disk('public')->assertMissing($path);
    }
});
