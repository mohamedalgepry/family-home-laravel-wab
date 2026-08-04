<?php

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Listings\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    Cache::flush();

    $this->article = Article::create([
        'category_id' => Category::create(['name_ar' => 'أخبار', 'name_en' => 'News', 'slug' => 'news'])->id,
        'title' => 'Test Article',
        'title_ar' => 'مقال تجريبي',
        'title_en' => 'Test Article',
        'slug' => 'test-article',
        'content' => 'Content',
    ]);
});

// ─── url attribute ────────────────────────────────────────────────────────────

it('returns empty string when path is null', function () {
    $image = new ArticleImage(['path' => null]);

    expect($image->url)->toBe('');
});

it('returns absolute http url unchanged', function () {
    $image = new ArticleImage(['path' => 'https://cdn.example.com/photo.jpg']);

    expect($image->url)->toBe('https://cdn.example.com/photo.jpg');
});

it('returns path starting with slash unchanged', function () {
    $image = new ArticleImage(['path' => '/uploads/photo.jpg']);

    expect($image->url)->toBe('/uploads/photo.jpg');
});

it('prefixes storage path with /storage/', function () {
    $image = new ArticleImage(['path' => 'articles/2026/01/photo.webp']);

    expect($image->url)->toBe('/storage/articles/2026/01/photo.webp');
});

it('does not double-prefix a path that already starts with storage/', function () {
    $image = new ArticleImage(['path' => 'articles/2026/01/photo.webp']);

    expect($image->url)->not->toContain('/storage//storage/');
});

// ─── thumb_url attribute ──────────────────────────────────────────────────────

it('returns empty string when path is null for thumb_url', function () {
    $image = new ArticleImage(['path' => null]);

    expect($image->thumb_url)->toBe('');
});

it('returns url directly for external paths in thumb_url', function () {
    $image = new ArticleImage(['path' => 'https://cdn.example.com/photo.jpg']);

    expect($image->thumb_url)->toBe('https://cdn.example.com/photo.jpg');
});

it('returns webp thumbnail path when webp thumb exists on disk', function () {
    $original = 'articles/2026/01/photo.webp';
    $thumbPath = 'articles/2026/01/thumb_photo.webp';

    Storage::disk('public')->put($thumbPath, 'thumb-data');

    $image = new ArticleImage(['path' => $original]);

    expect($image->thumb_url)->toBe('/storage/'.$thumbPath);
});

it('falls back to legacy thumbnail when only legacy format exists', function () {
    $original = 'articles/2026/01/photo.jpg';
    $legacyThumb = 'articles/2026/01/thumb_photo.jpg';

    Storage::disk('public')->put($legacyThumb, 'legacy-thumb-data');

    $image = new ArticleImage(['path' => $original]);

    expect($image->thumb_url)->toBe('/storage/'.$legacyThumb);
});

it('falls back to full url when no thumbnail exists', function () {
    $image = new ArticleImage(['path' => 'articles/2026/01/photo.jpg']);

    expect($image->thumb_url)->toBe('/storage/articles/2026/01/photo.jpg');
});

it('caches the thumb existence check and avoids a second disk hit', function () {
    $thumbPath = 'articles/2026/01/thumb_photo.webp';
    Storage::disk('public')->put($thumbPath, 'thumb-data');

    $image = new ArticleImage(['path' => 'articles/2026/01/photo.webp']);

    // First access populates cache.
    $first = $image->thumb_url;

    // Delete the file on disk — cache should still return the thumb path.
    Storage::disk('public')->delete($thumbPath);

    expect($image->thumb_url)->toBe($first);
});

// ─── link_url persisted and loaded ───────────────────────────────────────────

it('stores and retrieves link_url on article images', function () {
    $image = $this->article->images()->create([
        'path' => 'articles/2026/01/photo.webp',
        'position' => 'middle',
        'link_url' => 'https://example.com/property/123',
    ]);

    expect($this->article->images()->find($image->id)->link_url)
        ->toBe('https://example.com/property/123');
});

it('allows link_url to be null for images without a link', function () {
    $image = $this->article->images()->create([
        'path' => 'articles/2026/01/photo.webp',
        'position' => 'middle',
        'link_url' => null,
    ]);

    expect($this->article->images()->find($image->id)->link_url)->toBeNull();
});
