<?php

use App\Domain\Assistant\Services\AssistantOrchestratorService;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;

/**
 * Precision guards for the chat assistant:
 * unit cards must ONLY be attached when the user actually asks about
 * listings — greetings, thanks and advice questions stay clean. When units
 * are recommended, they are capped at a few focused picks, never a dump.
 */
beforeEach(function () {
    $this->user = User::create([
        'name' => 'Precision Agent',
        'email' => 'precision-'.uniqid().'@example.com',
        'password' => bcrypt('password123'),
        'role' => 'admin',
        'is_active' => true,
    ]);

    $this->area = Area::create([
        'name_ar' => 'التجمع الخامس',
        'name_en' => 'Fifth Settlement',
        'slug' => 'precision-area-'.uniqid(),
        'is_active' => true,
    ]);

    $type = UnitType::create([
        'name_ar' => 'شقة',
        'name_en' => 'Apartment',
        'slug' => 'precision-type-'.uniqid(),
    ]);

    $this->project = Project::create([
        'user_id' => $this->user->id,
        'area_id' => $this->area->id,
        'name' => 'مشروع الدقة',
        'name_ar' => 'مشروع الدقة',
        'slug' => 'precision-proj-'.uniqid(),
        'is_active' => true,
    ]);

    foreach (range(1, 8) as $i) {
        $unit = new Unit;
        $unit->forceFill([
            'name' => "شقة الدقة {$i}",
            'name_ar' => "شقة الدقة {$i}",
            'name_en' => "Precision Apt {$i}",
            'slug' => 'precision-unit-'.$i.'-'.uniqid(),
            'price' => 2_000_000 + $i * 400_000,
            'transaction' => 'sale',
            'payment_method' => $i % 2 ? 'installment' : 'cash',
            'rooms' => 2 + ($i % 3),
            'type_id' => $type->id,
            'area_id' => $this->area->id,
            'project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'is_active' => true,
        ])->save();
    }

    $this->orchestrator = app(AssistantOrchestratorService::class);
});

it('does not attach unit cards to greetings or small talk', function () {
    foreach (['مرحبا', 'السلام عليكم', 'ازيك عامل ايه', 'hello'] as $greeting) {
        $res = $this->orchestrator->chat($greeting, [], 'ar');

        expect($res['recommended_units'])->toBeEmpty()
            ->and($res['reply'])->not->toBeEmpty();
    }
});

it('does not attach unit cards to advice-only questions', function () {
    foreach ([
        'كاش ولا تقسيط أحسن؟',
        'أفضل مناطق الاستثمار',
        'المشاريع المميزة',
    ] as $question) {
        $res = $this->orchestrator->chat($question, [], 'ar');

        expect($res['recommended_units'])->toBeEmpty()
            ->and($res['reply'])->not->toBeEmpty();
    }
});

it('recommends at most 3 units for a budget search instead of dumping a list', function () {
    $res = $this->orchestrator->chat('عايز شقة بسعر 5 مليون', [], 'ar');

    expect($res['recommended_units'])->not->toBeEmpty()
        ->and(count($res['recommended_units']))->toBeLessThanOrEqual(3);
});

it('recommends at most 3 units for an installment search', function () {
    $res = $this->orchestrator->chat('شقق للبيع بالتقسيط', [], 'ar');

    expect($res['recommended_units'])->not->toBeEmpty()
        ->and(count($res['recommended_units']))->toBeLessThanOrEqual(3);
});

it('shows focused units when explicitly asked about a specific project', function () {
    $res = $this->orchestrator->chat('عايز اعرف وحدات مشروع الدقة', [], 'ar');

    expect($res['recommended_units'])->not->toBeEmpty()
        ->and(count($res['recommended_units']))->toBeLessThanOrEqual(4);
});

it('is honest when no units match the requested budget instead of dumping unrelated ones', function () {
    $res = $this->orchestrator->chat('عايز شقة بسعر 100 الف', [], 'ar');

    expect($res['recommended_units'])->toBeEmpty()
        ->and($res['reply'])->toContain('100,000');
});

it('responds instantly from the local engine without an API key', function () {
    $start = microtime(true);
    $res = $this->orchestrator->chat('مرحبا', [], 'ar');
    $elapsedMs = (microtime(true) - $start) * 1000;

    expect($res['reply'])->not->toBeEmpty()
        ->and($elapsedMs)->toBeLessThan(2000);
});
