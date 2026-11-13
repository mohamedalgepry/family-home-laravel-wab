<?php

use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\UnitExpiryNotification;
use App\Domain\Listings\Notifications\UnitPendingApprovalNotification;
use App\Domain\Assistant\Notifications\NewAssistantLeadNotification;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use App\Domain\Users\Notifications\NewMessageNotification;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

function createNotificationForAction(User $recipient, string $class, array $data): DatabaseNotification
{
    return DatabaseNotification::create([
        'id' => (string) Str::uuid(),
        'type' => $class,
        'notifiable_type' => User::class,
        'notifiable_id' => $recipient->id,
        'data' => $data,
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

test('assistant lead details are visible only to admins and do not inflate manager unread counts', function () {
    $admin = createUser('Lead Admin '.uniqid(), 'admin');
    $manager = createUser('Lead Manager '.uniqid(), 'manager');

    createNotificationForAction($admin, NewAssistantLeadNotification::class, [
        'type' => 'new_assistant_lead',
        'lead_id' => 101,
        'client_phone' => '01012345678',
    ]);
    createNotificationForAction($manager, NewAssistantLeadNotification::class, [
        'type' => 'new_assistant_lead',
        'lead_id' => 101,
        'client_phone' => '01012345678',
    ]);

    $service = app(NotificationService::class);

    expect($service->recent($admin))->toHaveCount(1)
        ->and($service->recent($manager))->toBe([])
        ->and($service->unreadCount($manager))->toBe(0);
});

test('approving a pending unit publishes it and keeps the notification as read', function () {
    $admin = createUser('Admin '.uniqid(), 'admin');
    $unit = createTestUnit([
        'user_id' => $admin->id,
        'is_active' => false,
    ]);
    $notification = createNotificationForAction($admin, UnitPendingApprovalNotification::class, [
        'type' => 'unit_pending_approval',
        'unit_id' => $unit->id,
        'unit_name' => $unit->name,
    ]);

    $response = $this->actingAs($admin)->post("/admin/units/{$unit->id}/approve");

    $response->assertRedirect();
    expect((bool) Unit::findOrFail($unit->id)->is_active)->toBeTrue()
        ->and(DatabaseNotification::whereKey($notification->id)->exists())->toBeTrue()
        ->and($notification->fresh()->read_at)->not->toBeNull();
});

test('approving an already-active unit acknowledges stale notification without deactivating it', function () {
    $admin = createUser('Admin '.uniqid(), 'admin');
    $unit = createTestUnit([
        'user_id' => $admin->id,
        'is_active' => true,
    ]);
    $notification = createNotificationForAction($admin, UnitPendingApprovalNotification::class, [
        'type' => 'unit_pending_approval',
        'unit_id' => $unit->id,
        'unit_name' => $unit->name,
    ]);

    $response = $this->actingAs($admin)->post("/admin/units/{$unit->id}/approve");

    $response->assertRedirect();
    expect((bool) Unit::findOrFail($unit->id)->is_active)->toBeTrue()
        ->and(DatabaseNotification::whereKey($notification->id)->exists())->toBeTrue()
        ->and($notification->fresh()->read_at)->not->toBeNull();
});

test('extending from an expiry notification changes expiry and keeps notification visible as read', function () {
    $admin = createUser('Admin '.uniqid(), 'admin');
    $unit = createTestUnit([
        'user_id' => $admin->id,
        'is_active' => true,
        'auto_delete_at' => now()->addDays(5),
    ]);
    $notification = createNotificationForAction($admin, UnitExpiryNotification::class, [
        'type' => 'unit_expiry_warning',
        'unit_id' => $unit->id,
        'unit_name' => $unit->name,
    ]);
    $oldExpiry = $unit->auto_delete_at->copy();

    $response = $this->actingAs($admin)->post("/admin/units/{$unit->id}/extend-expiry", [
        'duration_type' => '7_days',
    ]);

    $response->assertRedirect();
    expect(Unit::findOrFail($unit->id)->auto_delete_at->toDateString())
        ->toBe($oldExpiry->copy()->addDays(7)->toDateString())
        ->and(DatabaseNotification::whereKey($notification->id)->exists())->toBeTrue()
        ->and($notification->fresh()->read_at)->not->toBeNull();
});

test('marking a notification as read clears the cached unread counter', function () {
    $admin = createUser('Notif Read Admin '.uniqid(), 'admin');
    $notification = createNotificationForAction($admin, NewMessageNotification::class, [
        'type' => 'new_message',
        'message_id' => 1,
        'unit_id' => null,
    ]);

    $this->actingAs($admin)
        ->getJson('/admin/notifications/unread-count')
        ->assertOk()
        ->assertJson(['count' => 1]);

    $this->actingAs($admin)
        ->post("/admin/notifications/{$notification->id}/read")
        ->assertRedirect();

    // The second read must not be served from the counter cached above.
    $this->actingAs($admin)
        ->getJson('/admin/notifications/unread-count')
        ->assertOk()
        ->assertJson(['count' => 0]);

    expect($notification->fresh()->read_at)->not->toBeNull();
});

test('manager clear all preserves hidden assistant lead notifications', function () {
    $manager = createUser('Notif Clear Manager '.uniqid(), 'manager');
    $leadNotification = createNotificationForAction($manager, NewAssistantLeadNotification::class, [
        'type' => 'new_assistant_lead',
        'lead_id' => 102,
        'client_phone' => '01012345678',
    ]);
    $messageNotification = createNotificationForAction($manager, NewMessageNotification::class, [
        'type' => 'new_message',
        'message_id' => 12,
    ]);

    app(NotificationService::class)->clearAll($manager);

    expect(DatabaseNotification::whereKey($messageNotification->id)->exists())->toBeFalse()
        ->and(DatabaseNotification::whereKey($leadNotification->id)->exists())->toBeTrue();
});

test('mark all as read zeroes the counter and the cached value', function () {
    $admin = createUser('Notif ReadAll Admin '.uniqid(), 'admin');
    createNotificationForAction($admin, NewMessageNotification::class, ['type' => 'new_message', 'message_id' => 1]);
    createNotificationForAction($admin, NewMessageNotification::class, ['type' => 'new_message', 'message_id' => 2]);

    $this->actingAs($admin)
        ->getJson('/admin/notifications/unread-count')
        ->assertOk()
        ->assertJson(['count' => 2]);

    $this->actingAs($admin)->post('/admin/notifications/read-all')->assertRedirect();

    $this->actingAs($admin)
        ->getJson('/admin/notifications/unread-count')
        ->assertOk()
        ->assertJson(['count' => 0]);

    expect($admin->unreadNotifications()->count())->toBe(0);
    expect($admin->notifications()->count())->toBe(2);
});

test('clear all deletes notifications and resets cached counters and recent list', function () {
    $admin = createUser('Notif Clear Admin '.uniqid(), 'admin');
    createNotificationForAction($admin, NewMessageNotification::class, ['type' => 'new_message', 'message_id' => 1]);
    createNotificationForAction($admin, NewMessageNotification::class, ['type' => 'new_message', 'message_id' => 2]);

    $this->actingAs($admin)
        ->getJson('/admin/notifications/recent')
        ->assertOk()
        ->assertJsonCount(2, 'notifications');

    $this->actingAs($admin)
        ->getJson('/admin/notifications/unread-count')
        ->assertJson(['count' => 2]);

    $this->actingAs($admin)->delete('/admin/notifications/all/clear')->assertRedirect();

    expect(DatabaseNotification::where('notifiable_id', $admin->id)->count())->toBe(0);

    $this->actingAs($admin)
        ->getJson('/admin/notifications/recent')
        ->assertOk()
        ->assertJsonCount(0, 'notifications');

    $this->actingAs($admin)
        ->getJson('/admin/notifications/unread-count')
        ->assertJson(['count' => 0]);
});
