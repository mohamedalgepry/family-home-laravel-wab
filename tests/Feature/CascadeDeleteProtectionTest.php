<?php

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Users\Models\Message;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;

test('deleting a category sets article category_id to null and does NOT delete article', function () {
    $category = Category::create([
        'name_ar' => 'أخبار العقارات',
        'name_en' => 'Real Estate News',
        'slug' => 'real-estate-news-'.uniqid(),
        'slug_ar' => 'أخبار-العقارات-'.uniqid(),
        'slug_en' => 'real-estate-news-'.uniqid(),
    ]);

    $author = createUser('Test Author '.uniqid(), 'admin', null);

    $article = Article::create([
        'title' => 'مقال عقاري هام',
        'title_ar' => 'مقال عقاري هام',
        'title_en' => 'Important Article',
        'slug' => 'important-article-'.uniqid(),
        'slug_ar' => 'مقال-عقاري-هام-'.uniqid(),
        'slug_en' => 'important-article-'.uniqid(),
        'content' => 'محتوى المقال الهام',
        'category_id' => $category->id,
        'author_id' => $author->id,
        'is_published' => true,
    ]);

    expect($article->category_id)->toBe($category->id);

    // Delete category
    $category->delete();

    // Verify article still exists in database
    $freshArticle = Article::find($article->id);
    expect($freshArticle)->not->toBeNull();
    expect($freshArticle->category_id)->toBeNull();
});

test('deleting a unit sets message unit_id to null and preserves historical lead', function () {
    $agent = createUser('Agent '.uniqid(), 'agent', null);
    $unit = createTestUnit(['user_id' => $agent->id]);

    $message = Message::create([
        'client_name' => 'عميل مهتم',
        'client_email' => 'client@example.com',
        'client_phone' => '01000000000',
        'content' => 'أريد تفاصيل عن هذه الوحدة',
        'unit_id' => $unit->id,
        'agent_id' => $agent->id,
        'status' => 'pending',
    ]);

    expect($message->unit_id)->toBe($unit->id);

    // Delete unit
    $unit->delete();

    // Verify message survives with null unit_id
    $freshMessage = Message::find($message->id);
    expect($freshMessage)->not->toBeNull();
    expect($freshMessage->unit_id)->toBeNull();
    expect($freshMessage->client_name)->toBe('عميل مهتم');
});

test('deleting an agent sets message agent_id to null and preserves customer lead', function () {
    $agent = createUser('Agent Lead '.uniqid(), 'agent', null);

    $message = Message::create([
        'client_name' => 'عميل آخر',
        'client_email' => 'client2@example.com',
        'client_phone' => '01111111111',
        'content' => 'استفسار عام',
        'agent_id' => $agent->id,
        'status' => 'pending',
    ]);

    $agent->delete();

    $freshMessage = Message::find($message->id);
    expect($freshMessage)->not->toBeNull();
    expect($freshMessage->agent_id)->toBeNull();
});

test('deleting a user sets points_transactions manager_id and performed_by to null and preserves financial audit trail', function () {
    $manager = createUser('Manager '.uniqid(), 'manager', null);
    $agent = createUser('Agent Recipient '.uniqid(), 'agent', $manager->id);

    $transaction = \App\Domain\Points\Models\PointsTransaction::create([
        'manager_id' => $manager->id,
        'points' => 50,
        'type' => 'allocate',
        'notes' => 'Bonus points',
        'balance_after' => 50,
        'performed_by' => $manager->id,
    ]);

    expect($transaction->manager_id)->toBe($manager->id);
    expect($transaction->performed_by)->toBe($manager->id);

    // Delete manager
    $manager->delete();

    $freshTx = \App\Domain\Points\Models\PointsTransaction::find($transaction->id);
    expect($freshTx)->not->toBeNull();
    expect($freshTx->manager_id)->toBeNull();
    expect($freshTx->performed_by)->toBeNull();
    expect($freshTx->points)->toBe(50);
});

test('deleting a unit_type that has active units is restricted by foreign key', function () {
    $type = \App\Domain\Listings\Models\UnitType::create(['name_ar' => 'فيلا مميزة', 'name_en' => 'Special Villa']);
    $unit = createTestUnit(['type_id' => $type->id]);

    expect(fn () => $type->delete())->toThrow(\Illuminate\Database\QueryException::class);
});

test('deleting an area that has active units is restricted by foreign key', function () {
    $area = \App\Domain\Listings\Models\Area::create([
        'name_ar' => 'منطقة تجريبية',
        'name_en' => 'Test Region',
        'slug' => 'test-region-'.uniqid(),
    ]);
    $unit = createTestUnit(['area_id' => $area->id]);

    expect(fn () => $area->delete())->toThrow(\Illuminate\Database\QueryException::class);
});
