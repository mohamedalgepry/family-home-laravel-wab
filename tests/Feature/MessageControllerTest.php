<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\Message;

test('admin can view all messages on messages index page', function () {
    $admin = createUser('Admin User', 'admin', null);
    $agent = createUser('Agent User', 'agent', null);
    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    $unit = createTestUnit([
        'name' => 'وحدة تجريبية',
        'name_ar' => 'وحدة تجريبية',
        'name_en' => 'Test Unit',
        'user_id' => $agent->id,
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 100000,
    ]);

    Message::create([
        'unit_id' => $unit->id,
        'agent_id' => $agent->id,
        'client_name' => 'Ahmed Client',
        'client_phone' => '01000000000',
        'client_email' => 'client@example.com',
        'content' => 'Inquiry test content',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->get('/admin/messages');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Messages/Index')
        ->has('messages.data', 1)
    );
});

test('manager can view messages for their agents', function () {
    $manager = createUser('Manager User', 'manager', null);
    $agent = createUser('Agent User', 'agent', $manager->id);
    $otherAgent = createUser('Other Agent', 'agent', null);

    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    $unit = createTestUnit([
        'name' => 'وحدة تجريبية',
        'name_ar' => 'وحدة تجريبية',
        'name_en' => 'Test Unit',
        'user_id' => $agent->id,
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 100000,
    ]);

    Message::create([
        'unit_id' => $unit->id,
        'agent_id' => $agent->id,
        'client_name' => 'Agent Client',
        'client_phone' => '01000000000',
        'content' => 'Test message',
        'status' => 'pending',
    ]);

    Message::create([
        'unit_id' => $unit->id,
        'agent_id' => $otherAgent->id,
        'client_name' => 'Other Client',
        'client_phone' => '01111111111',
        'content' => 'Other message',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($manager)->get('/admin/messages');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Messages/Index')
        ->has('messages.data', 1)
    );
});
