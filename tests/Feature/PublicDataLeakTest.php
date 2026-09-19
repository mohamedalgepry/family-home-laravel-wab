<?php

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Users\Models\User;

use function Pest\Laravel\get;

/**
 * Public endpoints must never expose internal columns
 * (user_id, priority_points, is_pinned, auto_delete_at, views_count).
 */
beforeEach(function () {
    $this->agent = User::firstOrCreate(
        ['email' => 'leak-agent@test.com'],
        ['name' => 'Leak Agent', 'password' => 'x']
    );
    $this->agent->forceFill(['role' => 'agent', 'is_active' => true, 'slug' => 'leak-test-agent'])->save();
});

it('does not leak internal unit columns on the comparison page', function () {
    $unit = createTestUnit([
        'user_id' => $this->agent->id,
        'is_active' => true,
        'priority_points' => 555,
    ]);

    $response = get("/ar/compare?type=unit&ids={$unit->id}");

    $response->assertOk();

    $items = $response->viewData('page')['props']['items'];

    expect($items)->toHaveCount(1);

    $item = (array) $items[0];

    // Fields the page needs are present
    expect($item)->toHaveKeys(['id', 'name', 'slug', 'price', 'images', 'features']);

    // Internal fields must NOT be exposed
    expect($item)->not->toHaveKey('user_id')
        ->and($item)->not->toHaveKey('priority_points')
        ->and($item)->not->toHaveKey('is_pinned')
        ->and($item)->not->toHaveKey('auto_delete_at')
        ->and($item)->not->toHaveKey('views_count');
});

it('does not leak internal unit columns on the comparison JSON endpoint', function () {
    $unit = createTestUnit([
        'user_id' => $this->agent->id,
        'is_active' => true,
        'priority_points' => 999,
    ]);

    $response = get("/ar/compare?type=unit&ids={$unit->id}", ['Accept' => 'application/json']);

    $response->assertOk();

    $item = $response->json('items.0');

    expect($item)->toHaveKey('id')
        ->and($item)->not->toHaveKey('user_id')
        ->and($item)->not->toHaveKey('priority_points')
        ->and($item)->not->toHaveKey('is_pinned')
        ->and($item)->not->toHaveKey('auto_delete_at');
});

it('does not leak internal project columns on the comparison page', function () {
    $project = new Project;
    $project->forceFill([
        'name' => 'Leak Project',
        'name_ar' => 'مشروع',
        'name_en' => 'Leak Project',
        'slug' => 'leak-project-'.uniqid(),
        'slug_ar' => 'leak-project-ar-'.uniqid(),
        'slug_en' => 'leak-project-en-'.uniqid(),
        'user_id' => $this->agent->id,
        'is_active' => true,
    ]);
    $project->save();

    $response = get("/ar/compare?type=project&ids={$project->id}");

    $response->assertOk();

    $items = $response->viewData('page')['props']['items'];

    expect($items)->toHaveCount(1);

    $item = (array) $items[0];

    expect($item)->toHaveKeys(['id', 'name', 'slug', 'units_count', 'images'])
        ->and($item)->not->toHaveKey('user_id')
        ->and($item)->not->toHaveKey('auto_delete_at')
        ->and($item)->not->toHaveKey('views_count');
});

it('does not leak internal unit columns or agent credentials on the public agent page', function () {
    createTestUnit([
        'user_id' => $this->agent->id,
        'is_active' => true,
        'priority_points' => 777,
    ]);

    $response = get('/ar/agents/leak-test-agent');

    $response->assertOk();

    $props = $response->viewData('page')['props'];
    $unitData = (array) $props['units']['data'][0];

    expect($unitData)->toHaveKeys(['id', 'name', 'slug', 'price'])
        ->and($unitData)->not->toHaveKey('user_id')
        ->and($unitData)->not->toHaveKey('is_pinned')
        ->and($unitData)->not->toHaveKey('auto_delete_at');

    // Agent props must not leak email or password hash
    $agentData = (array) $props['agent'];
    expect($agentData)->not->toHaveKey('email')
        ->and($agentData)->not->toHaveKey('password');
});

it('excludes inactive units from public comparison', function () {
    $active = createTestUnit(['user_id' => $this->agent->id, 'is_active' => true]);
    $inactive = createTestUnit(['user_id' => $this->agent->id, 'is_active' => false]);

    $response = get("/ar/compare?type=unit&ids={$active->id},{$inactive->id}");

    $response->assertOk();

    $items = collect($response->viewData('page')['props']['items']);

    expect($items)->toHaveCount(1)
        ->and($items->first()['id'])->toBe($active->id);
});

it('does not leak internal fields from UnitPublicResource on public unit pages', function () {
    $unit = createTestUnit([
        'user_id' => $this->agent->id,
        'is_active' => true,
        'priority_points' => 888,
        'is_deal' => true,
    ]);

    $response = get('/ar/units/'.$unit->slug);

    $response->assertOk();

    $unitProps = (array) $response->viewData('page')['props']['unit'];

    // Needed public fields survive
    expect($unitProps)->toHaveKeys(['id', 'name', 'slug', 'price']);

    // Internal ranking/visibility flags must never reach the public payload
    expect($unitProps)->not->toHaveKey('priority_points')
        ->and($unitProps)->not->toHaveKey('is_active')
        ->and($unitProps)->not->toHaveKey('is_deal')
        ->and($unitProps)->not->toHaveKey('user_id')
        ->and($unitProps)->not->toHaveKey('views_count')
        ->and($unitProps)->not->toHaveKey('auto_delete_at');
});

it('does not leak internal fields from ProjectPublicResource on public project pages', function () {
    $project = new Project;
    $project->forceFill([
        'name' => 'Resource Leak Project',
        'name_ar' => 'مشروع',
        'name_en' => 'Resource Leak Project',
        'slug' => 'resource-leak-'.uniqid(),
        'slug_ar' => 'resource-leak-ar-'.uniqid(),
        'slug_en' => 'resource-leak-en-'.uniqid(),
        'user_id' => $this->agent->id,
        'is_active' => true,
    ]);
    $project->save();

    $response = get('/ar/projects/'.$project->slug);

    $response->assertOk();

    $projectProps = (array) $response->viewData('page')['props']['project'];

    expect($projectProps)->toHaveKeys(['id', 'name', 'slug'])
        ->and($projectProps)->not->toHaveKey('is_active')
        ->and($projectProps)->not->toHaveKey('user_id')
        ->and($projectProps)->not->toHaveKey('views_count')
        ->and($projectProps)->not->toHaveKey('auto_delete_at');
});

it('does not leak is_published or author internals on public article pages', function () {
    $article = Article::create([
        'title' => 'Leak Article',
        'title_ar' => 'مقال',
        'title_en' => 'Leak Article',
        'content' => 'x',
        'content_ar' => 'س',
        'content_en' => 'x',
        'slug' => 'leak-article-'.uniqid(),
        'slug_ar' => 'leak-article-ar-'.uniqid(),
        'slug_en' => 'leak-article-en-'.uniqid(),
        'is_published' => true,
    ]);

    $response = get('/ar/articles/'.$article->slug_ar);

    $response->assertOk();

    $articleProps = (array) $response->viewData('page')['props']['article'];

    expect($articleProps)->toHaveKeys(['id', 'title', 'slug'])
        ->and($articleProps)->not->toHaveKey('is_published')
        ->and($articleProps)->not->toHaveKey('user_id')
        ->and($articleProps)->not->toHaveKey('views_count');
});

it('never exposes agent email or balance fields through public unit user relation', function () {
    $unit = createTestUnit([
        'user_id' => $this->agent->id,
        'is_active' => true,
    ]);

    $response = get('/ar/units/'.$unit->slug);

    $response->assertOk();

    $html = $response->getContent();

    // The agent email must not appear anywhere in the public page payload
    expect($html)->not->toContain('leak-agent@test.com');

    $unitProps = (array) $response->viewData('page')['props']['unit'];
    if (isset($unitProps['user']) && is_array($unitProps['user'])) {
        expect($unitProps['user'])->not->toHaveKey('email')
            ->and($unitProps['user'])->not->toHaveKey('points_balance')
            ->and($unitProps['user'])->not->toHaveKey('initial_monthly_balance')
            ->and($unitProps['user'])->not->toHaveKey('manager_id')
            ->and($unitProps['user'])->not->toHaveKey('role');
    }
});

it('caps comparison items at 4 even when more ids are supplied', function () {
    $ids = collect(range(1, 6))
        ->map(fn () => createTestUnit(['user_id' => $this->agent->id, 'is_active' => true])->id)
        ->implode(',');

    $response = get("/ar/compare?type=unit&ids={$ids}");

    $response->assertOk();

    expect($response->viewData('page')['props']['items'])->toHaveCount(4);
});
