<?php

use App\Domain\Listings\Actions\CreateArticleAction;
use App\Domain\Listings\DTOs\CreateArticleData;
use App\Domain\Listings\Models\Category;

test('create article generates unique slugs without collision', function () {
    $category = Category::create([
        'name_ar' => 'أخبار',
        'name_en' => 'News',
        'slug' => 'news-'.uniqid(),
    ]);

    $action = app(CreateArticleAction::class);

    $data1 = CreateArticleData::from([
        'category_id' => $category->id,
        'title_ar' => 'عقار مميز',
        'title_en' => 'Prime Real Estate',
        'content_ar' => 'تفاصيل العقار',
        'content_en' => 'Real estate details',
    ]);

    $article1 = $action->execute($data1);
    expect($article1->slug)->toBe('prime-real-estate');

    // Create second article with same English and Arabic title
    $data2 = CreateArticleData::from([
        'category_id' => $category->id,
        'title_ar' => 'عقار مميز',
        'title_en' => 'Prime Real Estate',
        'content_ar' => 'تفاصيل العقار 2',
        'content_en' => 'Real estate details 2',
    ]);

    $article2 = $action->execute($data2);
    expect($article2->slug)->not->toBe($article1->slug);
    expect($article2->id)->not->toBe($article1->id);
});
