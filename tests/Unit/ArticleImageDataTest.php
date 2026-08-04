<?php

use App\Domain\Listings\DTOs\ArticleImageData;

// ─── hasImages ────────────────────────────────────────────────────────────────

it('reports no images when paths array is empty', function () {
    $dto = new ArticleImageData(paths: []);

    expect($dto->hasImages())->toBeFalse();
});

it('reports has images when at least one path is provided', function () {
    $dto = new ArticleImageData(paths: ['articles/2026/01/a.jpg']);

    expect($dto->hasImages())->toBeTrue();
});

// ─── metaForIndex ─────────────────────────────────────────────────────────────

it('returns per-index meta when all arrays are populated', function () {
    $dto = new ArticleImageData(
        paths: ['a.jpg', 'b.jpg'],
        alts: ['First alt', 'Second alt'],
        positions: ['top', 'bottom'],
        links: ['https://example.com', 'https://another.com'],
    );

    expect($dto->metaForIndex(0))->toBe([
        'alt_text' => 'First alt',
        'link_url' => 'https://example.com',
        'position' => 'top',
    ])->and($dto->metaForIndex(1))->toBe([
        'alt_text' => 'Second alt',
        'link_url' => 'https://another.com',
        'position' => 'bottom',
    ]);
});

it('defaults to middle position and nulls when arrays are shorter than paths', function () {
    $dto = new ArticleImageData(
        paths: ['a.jpg', 'b.jpg', 'c.jpg'],
        alts: ['Only first alt'],
    );

    expect($dto->metaForIndex(1))->toBe([
        'alt_text' => null,
        'link_url' => null,
        'position' => 'middle',
    ])->and($dto->metaForIndex(2))->toBe([
        'alt_text' => null,
        'link_url' => null,
        'position' => 'middle',
    ]);
});

it('returns all nulls and default position for an index with no metadata at all', function () {
    $dto = new ArticleImageData(paths: ['a.jpg']);

    expect($dto->metaForIndex(0))->toBe([
        'alt_text' => null,
        'link_url' => null,
        'position' => 'middle',
    ]);
});

// ─── empty() named constructor ────────────────────────────────────────────────

it('empty() factory produces a dto with no images', function () {
    $dto = ArticleImageData::empty();

    expect($dto->hasImages())->toBeFalse()
        ->and($dto->paths)->toBe([]);
});
