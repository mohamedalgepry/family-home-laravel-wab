<?php

use App\Domain\Listings\Models\Project;
use App\Domain\Users\Models\User;

use function Pest\Laravel\get;

/**
 * Canary-based leak detection: seed listings whose sensitive fields carry
 * unique sentinel values, then render every public page and assert none of
 * the sentinels appear anywhere in the response body. Catches leaks through
 * ANY channel (props, JSON-LD, meta tags, inline scripts) — not just known keys.
 */
beforeEach(function () {
    $this->agent = User::firstOrCreate(
        ['email' => 'canary-9f3k7q@secret-canary.test'],
        ['name' => 'Canary Agent', 'password' => 'x']
    );
    $this->agent->forceFill([
        'role' => 'agent',
        'is_active' => true,
        'slug' => 'canary-leak-agent',
        'points_balance' => 42424242,
        'initial_monthly_balance' => 53535353,
    ])->save();

    $this->unit = createTestUnit([
        'user_id' => $this->agent->id,
        'is_active' => true,
        'priority_points' => 98765432,
        'views_count' => 13571357,
    ]);

    $this->project = new Project;
    $this->project->forceFill([
        'name' => 'Canary Project',
        'name_ar' => 'مشروع كناري',
        'name_en' => 'Canary Project',
        'slug' => 'canary-leak-project-'.uniqid(),
        'slug_ar' => 'canary-leak-project-ar-'.uniqid(),
        'slug_en' => 'canary-leak-project-en-'.uniqid(),
        'user_id' => $this->agent->id,
        'is_active' => true,
        'views_count' => 24682468,
    ]);
    $this->project->save();

    $this->canaries = [
        'canary-9f3k7q@secret-canary.test' => 'agent email',
        '42424242' => 'points_balance',
        '53535353' => 'initial_monthly_balance',
        '98765432' => 'priority_points',
        '13571357' => 'unit views_count',
        '24682468' => 'project views_count',
    ];
});

function assertNoCanaries(string $body, array $canaries, string $page): void
{
    foreach ($canaries as $needle => $label) {
        expect(str_contains($body, $needle))->toBeFalse(
            "Sensitive value '{$label}' ({$needle}) leaked into public page {$page}"
        );
    }
}

it('leaks no sensitive sentinel values on the unit detail page', function () {
    $response = get('/ar/units/'.$this->unit->slug);

    $response->assertOk();
    assertNoCanaries($response->getContent(), $this->canaries, 'unit show');
});

it('leaks no sensitive sentinel values on the project detail page', function () {
    $response = get('/ar/projects/'.$this->project->slug);

    $response->assertOk();
    assertNoCanaries($response->getContent(), $this->canaries, 'project show');
});

it('leaks no sensitive sentinel values on listing and comparison pages', function () {
    foreach ([
        '/ar/units',
        '/ar/projects',
        "/ar/compare?type=unit&ids={$this->unit->id}",
        "/ar/compare?type=project&ids={$this->project->id}",
        '/ar/agents/canary-leak-agent',
    ] as $path) {
        $response = get($path);
        $response->assertOk();
        assertNoCanaries($response->getContent(), $this->canaries, $path);
    }
});
