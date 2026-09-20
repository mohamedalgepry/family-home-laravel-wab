<?php

use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;

/**
 * End-to-end behavior of the public "contact about a unit" flow:
 * routing to the right agent, rejecting inactive units, and sanitization.
 */
test('contacting an active unit stores the message routed to the unit owner', function () {
    $agent = createUser('Contact Flow Agent', 'agent');
    $unit = createTestUnit(['user_id' => $agent->id, 'is_active' => true]);

    $response = $this->post("/units/{$unit->slug}/contact", [
        'client_name' => 'Interested Buyer',
        'client_phone' => '01099999999',
        'content' => 'I want to visit this unit',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $message = Message::where('unit_id', $unit->id)->latest('id')->first();

    expect($message)->not->toBeNull()
        ->and($message->agent_id)->toBe($agent->id)
        ->and($message->status)->toBe('pending')
        ->and($message->client_name)->toBe('Interested Buyer');
});

test('contacting an inactive unit returns 404 and stores nothing', function () {
    $agent = createUser('Inactive Unit Agent', 'agent');
    $unit = createTestUnit(['user_id' => $agent->id, 'is_active' => false]);

    $before = Message::count();

    $response = $this->post("/units/{$unit->slug}/contact", [
        'client_name' => 'Should Fail',
        'client_phone' => '01088888888',
        'content' => 'This must be rejected',
    ]);

    $response->assertNotFound();
    expect(Message::count())->toBe($before);
});

test('contact message html payload is sanitized before storage', function () {
    $agent = createUser('Sanitize Flow Agent', 'agent');
    $unit = createTestUnit(['user_id' => $agent->id, 'is_active' => true]);

    $response = $this->post("/units/{$unit->slug}/contact", [
        'client_name' => '<script>alert(1)</script>Bob',
        'client_phone' => '01077777777',
        'content' => 'Hello <img src=x onerror=alert(2)> world',
    ]);

    $response->assertSessionHasNoErrors();

    $message = Message::where('unit_id', $unit->id)->latest('id')->first();

    expect($message)->not->toBeNull()
        ->and($message->client_name)->not->toContain('<script>')
        ->and($message->content)->not->toContain('<img')
        ->and($message->content)->not->toContain('onerror');
});

test('general contact message without unit is routed to the first admin', function () {
    $admin = User::where('role', 'admin')->first()
        ?? createUser('Fallback Admin', 'admin');

    $response = $this->post('/ar/contact', [
        'client_name' => 'General Inquirer',
        'client_phone' => '01066666666',
        'content' => 'General question about services',
    ]);

    $response->assertSessionHasNoErrors();

    $message = Message::whereNull('unit_id')
        ->where('client_name', 'General Inquirer')
        ->latest('id')
        ->first();

    expect($message)->not->toBeNull()
        ->and($message->agent_id)->toBe($admin->id);
});
