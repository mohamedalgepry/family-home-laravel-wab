<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

test('area relation sync strips system fields and does not corrupt timestamps', function () {
    $admin = createUser('Area Sync Admin '.uniqid(), 'admin');
    $this->actingAs($admin);

    $area = Area::create([
        'name_ar' => 'منطقة اختبار المميزات '.uniqid(),
        'name_en' => 'Feature Sync Area '.uniqid(),
        'slug' => 'feature-sync-'.uniqid(),
    ]);

    // Simulate the exact payload the admin React form sends:
    // full rows including id and ISO-8601 timestamps (created_at/updated_at).
    $payload = [
        'features' => [
            [
                'id' => null,
                'title_ar' => 'ميزة جديدة',
                'title_en' => 'New Feature',
                'description_ar' => 'وصف',
                'description_en' => 'Description',
                'icon' => 'briefcase',
                'sort_order' => 1,
                'is_active' => 1,
            ],
        ],
    ];

    $response = $this->putJson("/admin/areas/{$area->id}", array_merge([
        'name_ar' => $area->name_ar,
        'name_en' => $area->name_en,
    ], $payload));

    $response->assertRedirect();
    expect($area->fresh()->features)->toHaveCount(1);

    // Now update the existing row with a payload that includes
    // ISO-8601 timestamps — this is what crashed MySQL strict mode before.
    $feature = $area->features->first();
    $isoTimestamp = now()->utc()->toIso8601String();

    $updatePayload = [
        'features' => [
            array_merge($payload['features'][0], [
                'id' => $feature->id,
                'title_en' => 'Updated Feature',
                'created_at' => $isoTimestamp,
                'updated_at' => $isoTimestamp,
            ]),
        ],
    ];

    $response = $this->putJson("/admin/areas/{$area->id}", array_merge([
        'name_ar' => $area->name_ar,
        'name_en' => $area->name_en,
    ], $updatePayload));

    $response->assertRedirect();

    $fresh = DB::table('area_features')->where('id', $feature->id)->first();
    expect($fresh->title_en)->toBe('Updated Feature');
});

test('area relation sync deletes removed items and creates new ones', function () {
    $admin = createUser('Area Sync Admin 2 '.uniqid(), 'admin');
    $this->actingAs($admin);

    $area = Area::create([
        'name_ar' => 'منطقة اختبار الحذف '.uniqid(),
        'name_en' => 'Sync Delete Area '.uniqid(),
        'slug' => 'sync-delete-'.uniqid(),
    ]);

    $this->putJson("/admin/areas/{$area->id}", [
        'name_ar' => $area->name_ar,
        'name_en' => $area->name_en,
        'faqs' => [
            ['question_ar' => 'س1', 'question_en' => 'Q1', 'answer_ar' => 'ج1', 'answer_en' => 'A1', 'sort_order' => 1],
            ['question_ar' => 'س2', 'question_en' => 'Q2', 'answer_ar' => 'ج2', 'answer_en' => 'A2', 'sort_order' => 2],
        ],
    ]);

    $firstId = $area->fresh()->faqs->sortBy('id')->first()->id;
    expect($area->fresh()->faqs)->toHaveCount(2);

    // Keep only the first FAQ, add a third one
    $this->putJson("/admin/areas/{$area->id}", [
        'name_ar' => $area->name_ar,
        'name_en' => $area->name_en,
        'faqs' => [
            ['id' => $firstId, 'question_ar' => 'س1 معدلة', 'question_en' => 'Q1 updated', 'answer_ar' => 'ج1', 'answer_en' => 'A1', 'sort_order' => 1, 'created_at' => now()->toIso8601String(), 'updated_at' => now()->toIso8601String()],
            ['question_ar' => 'س3', 'question_en' => 'Q3', 'answer_ar' => 'ج3', 'answer_en' => 'A3', 'sort_order' => 3],
        ],
    ]);

    $freshFaqs = $area->fresh()->faqs;
    expect($freshFaqs)->toHaveCount(2);
    expect($freshFaqs->pluck('id'))->toContain($firstId);
    expect($freshFaqs->where('id', $firstId)->first()->question_en)->toBe('Q1 updated');
});
