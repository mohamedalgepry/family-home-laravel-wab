<?php

use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\UnitExpiryNotification;
use App\Domain\Listings\Notifications\UnitPendingApprovalNotification;
use App\Domain\Users\Models\User;
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
