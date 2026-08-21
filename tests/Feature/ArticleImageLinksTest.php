<?php

use App\Domain\Listings\DTOs\ArticleImageData;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\ArticleImage;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Services\ArticleService;
use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

// ─── shared helpers ───────────────────────────────────────────────────────────

function makeArticleData(int $categoryId, string $titleEn = 'Test Article'): CreateArticleData
{
    return CreateArticleData::from([
        'category_id' => $categoryId,
        'title_ar' => 'مقال تجريبي',
        'title_en' => $titleEn,
        'content_ar' => '<p>محتوى</p>',
        'content_en' => '<p>Content</p>',
        'keywords' => [],
        'meta_description' => '',
        'is_published' => true,
    ]);
}

function makeCategory(string $slugSuffix = ''): Category
{
    static $counter = 0;
    $counter++;

    return Category::create([
        'name_ar' => 'تصنيف',
        'name_en' => 'Category',
        'slug' => 'category-'.$counter.($slugSuffix ? "-{$slugSuffix}" : ''),
    ]);
}

// ─── setup ────────────────────────────────────────────────────────────────────

beforeEach(function () {
    Storage::fake('public');
    Queue::fake();

    $this->admin = new User(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => 'x']);
    $this->admin->role = 'admin';
    $this->admin->save();

    $this->service = app(ArticleService::class);
});

// ─── ArticleService: createArticle with link_url ──────────────────────────────

describe('createArticle with image links', function () {
    it('persists link_url for new images when provided', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/a.webp', 'articles/2026/01/b.webp'],
                alts: ['Alt A', 'Alt B'],
                positions: ['middle', 'middle'],
                links: ['https://example.com/link-a', 'https://example.com/link-b'],
            ),
        );

        $images = $article->images()->whereNotNull('link_url')->orderBy('sort_order')->get();

        expect($images)->toHaveCount(2)
            ->and($images[0]->link_url)->toBe('https://example.com/link-a')
            ->and($images[1]->link_url)->toBe('https://example.com/link-b');
    });

    it('allows some images to have a link and others not', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/c.webp', 'articles/2026/01/d.webp'],
                links: ['https://example.com'],    // only first index has a link
            ),
        );

        $images = $article->images()->orderBy('sort_order')->get();

        expect($images[0]->link_url)->toBe('https://example.com')
            ->and($images[1]->link_url)->toBeNull();
    });

    it('creates article without images when empty ArticleImageData is passed', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: ArticleImageData::empty(),
        );

        expect($article->images()->count())->toBe(0);
    });
});

// ─── ArticleService: updateArticle with image link updates ────────────────────

describe('updateArticle with image link updates', function () {
    it('updates link_url on an existing image via image_updates', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/e.webp'],
                positions: ['middle'],
            ),
        );

        $imageId = $article->images()->first()->id;

        $this->service->updateArticle(
            articleId: $article->id,
            data: makeArticleData($category->id, 'Updated Article'),
            imageUpdates: [$imageId => ['link_url' => 'https://updated.com']],
        );

        expect(ArticleImage::find($imageId)->link_url)->toBe('https://updated.com');
    });

    it('clears link_url when an empty string is provided in image_updates', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/f.webp'],
                links: ['https://original.com'],
            ),
        );

        $imageId = $article->images()->first()->id;

        $this->service->updateArticle(
            articleId: $article->id,
            data: makeArticleData($category->id),
            imageUpdates: [$imageId => ['link_url' => '']],
        );

        expect(ArticleImage::find($imageId)->link_url)->toBe('');
    });

    it('adds link_url to new images during update', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(data: makeArticleData($category->id));

        $this->service->updateArticle(
            articleId: $article->id,
            data: makeArticleData($category->id, 'With New Images'),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/g.webp'],
                positions: ['bottom'],
                links: ['https://newlink.com'],
            ),
        );

        $image = $article->fresh()->images()->first();

        expect($image->link_url)->toBe('https://newlink.com')
            ->and($image->position)->toBe('bottom');
    });
});

// ─── ArticleService: image deletion during update ────────────────────────────

describe('updateArticle image deletion', function () {
    it('removes images listed in deleted_image_ids from the database', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/h.webp', 'articles/2026/01/i.webp'],
            ),
        );

        $imageIds = $article->images()->pluck('id')->all();

        $this->service->updateArticle(
            articleId: $article->id,
            data: makeArticleData($category->id),
            deletedImageIds: [$imageIds[0]],
        );

        expect($article->fresh()->images()->pluck('id')->all())
            ->not->toContain($imageIds[0])
            ->toContain($imageIds[1]);
    });

    it('only deletes images belonging to the correct article', function () {
        $category = makeCategory();
        $articleA = $this->service->createArticle(
            data: makeArticleData($category->id, 'Article A'),
            newImages: new ArticleImageData(paths: ['articles/2026/01/j.webp']),
        );
        $articleB = $this->service->createArticle(
            data: makeArticleData($category->id, 'Article B'),
            newImages: new ArticleImageData(paths: ['articles/2026/01/k.webp']),
        );

        $imageIdFromB = $articleB->images()->first()->id;

        // Try to delete articleB's image while updating articleA — should be a no-op.
        $this->service->updateArticle(
            articleId: $articleA->id,
            data: makeArticleData($category->id, 'Article A'),
            deletedImageIds: [$imageIdFromB],
        );

        expect(ArticleImage::find($imageIdFromB))->not->toBeNull();
    });
});

// ─── ArticleService: cover image replacement ─────────────────────────────────

describe('cover image handling', function () {
    it('stores a cover image with header position', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            coverImagePath: 'articles/2026/01/cover.webp',
        );

        $header = $article->images()->where('position', 'header')->first();

        expect($header)->not->toBeNull()
            ->and($header->path)->toBe('articles/2026/01/cover.webp');
    });

    it('replaces the existing cover image during update', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            coverImagePath: 'articles/2026/01/old-cover.webp',
        );

        $this->service->updateArticle(
            articleId: $article->id,
            data: makeArticleData($category->id),
            coverImagePath: 'articles/2026/01/new-cover.webp',
        );

        $covers = $article->fresh()->images()->where('position', 'header')->get();

        expect($covers)->toHaveCount(1)
            ->and($covers->first()->path)->toBe('articles/2026/01/new-cover.webp');
    });
});

// ─── ArticleService: deleteArticle ───────────────────────────────────────────

describe('deleteArticle', function () {
    it('removes the article and all its images from the database', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: new ArticleImageData(paths: ['articles/2026/01/l.webp']),
        );

        $articleId = $article->id;
        $imageId = $article->images()->first()->id;

        $this->service->deleteArticle($articleId);

        expect(Article::find($articleId))->toBeNull()
            ->and(ArticleImage::find($imageId))->toBeNull();
    });
});

// ─── ArticleService: thumbnails are dispatched ───────────────────────────────

describe('thumbnail generation', function () {
    it('dispatches GenerateThumbnailsJob for new article images', function () {
        $category = makeCategory();

        $this->service->createArticle(
            data: makeArticleData($category->id),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/m.webp'],
            ),
        );

        Queue::assertPushed(GenerateThumbnailsJob::class, fn ($job) => in_array('articles/2026/01/m.webp', $job->paths, true)
        );
    });
});

// ─── HTTP: admin article store endpoint persists link_url ────────────────────

describe('HTTP article store/update with link_url', function () {
    it('stores new_image_links through the article store endpoint', function () {
        $category = makeCategory();

        Storage::disk('public')->put('articles/2026/01/upload.jpg', 'fake-image-data');

        $fakeFile = createFakeImage('photo.jpg');

        $this->actingAs($this->admin)
            ->post(route('admin.articles.store'), [
                'category_id' => $category->id,
                'title_en' => 'HTTP Store Test',
                'content_en' => '<p>Body</p>',
                'is_published' => true,
                'images' => [$fakeFile],
                'new_image_alts' => ['Photo alt'],
                'new_image_positions' => ['middle'],
                'new_image_links' => ['https://store-link.com'],
            ])
            ->assertRedirect(route('admin.articles.index'));

        $article = Article::where('title_en', 'HTTP Store Test')->first();

        expect($article)->not->toBeNull();

        $image = $article->images()->whereNotNull('link_url')->first();

        expect($image?->link_url)->toBe('https://store-link.com');
    });

    it('updates link_url through the article update endpoint', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id, 'HTTP Update Test'),
            newImages: new ArticleImageData(paths: ['articles/2026/01/n.webp']),
        );

        $imageId = $article->images()->first()->id;

        $this->actingAs($this->admin)
            ->put(route('admin.articles.update', $article), [
                'category_id' => $category->id,
                'title_en' => 'HTTP Update Test',
                'content_en' => '<p>Body</p>',
                'is_published' => true,
                'image_updates' => [
                    $imageId => [
                        'alt_text' => 'Updated alt',
                        'position' => 'middle',
                        'link_url' => 'https://updated-link.com',
                    ],
                ],
            ])
            ->assertRedirect(route('admin.articles.index'));

        expect(ArticleImage::find($imageId)->link_url)->toBe('https://updated-link.com');
    });

    it('includes position, link_url, and sort_order in ArticlePublicResource output', function () {
        $category = makeCategory();
        $article = $this->service->createArticle(
            data: makeArticleData($category->id, 'Resource Test'),
            newImages: new ArticleImageData(
                paths: ['articles/2026/01/inline.jpg'],
                alts: ['0' => 'Alt Image'],
                positions: ['0' => 'middle'],
                links: ['0' => 'https://example.com'],
            ),
        );

        $resource = \App\Http\Resources\Public\ArticlePublicResource::make($article->load('images'))->resolve();

        expect($resource['images'])->toHaveCount(1)
            ->and($resource['images'][0]['position'])->toBe('middle')
            ->and($resource['images'][0]['link_url'])->toBe('https://example.com')
            ->and($resource['images'][0]['alt_text'])->toBe('Alt Image');
    });

    it('allows admins to upload media for editor inline insertion', function () {
        $fakeFile = createFakeImage('inline-editor.jpg');

        $response = $this->actingAs($this->admin)
            ->postJson(route('admin.media.upload'), [
                'image' => $fakeFile,
            ]);

        $response->assertOk()
            ->assertJsonStructure(['url']);

        expect($response->json('url'))->toContain('/storage/editor/');
    });
});
