<?php

use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\UnitExtendedNotification;
use App\Domain\Listings\Services\SitemapService;
use App\Domain\Points\Jobs\AutoDeleteReviewJob;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Notification;

test('1. admin extends unit by 7 days', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(5),
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '7_days',
        ]);

    $response->assertRedirect();
    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(7)->format('Y-m-d'));
});

test('2. admin extends unit by 15 days', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(3),
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '15_days',
        ]);

    $response->assertRedirect();
    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(15)->format('Y-m-d'));
});

test('3. admin extends unit by 30 days', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(10),
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '30_days',
        ]);

    $response->assertRedirect();
    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(30)->format('Y-m-d'));
});

test('4. admin extends unit using auto delete setting default', function () {
    Setting::setValue('auto_delete_days', '30');
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(2),
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => 'auto_delete_setting',
        ]);

    $response->assertRedirect();
    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(30)->format('Y-m-d'));
});

test('5. changing auto_delete_days setting dynamically changes extension duration', function () {
    Setting::setValue('auto_delete_days', '60');
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(4),
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => 'auto_delete_setting',
        ]);

    $response->assertRedirect();
    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(60)->format('Y-m-d'));
});

test('6. custom extension with 45 days works correctly', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(5),
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => 'custom',
            'days' => 45,
        ]);

    $response->assertRedirect();
    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(45)->format('Y-m-d'));
});

test('7. custom extension with 0 days fails validation', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(5),
    ]);

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => 'custom',
            'days' => 0,
        ]);

    $response->assertSessionHasErrors(['days']);
});

test('8. custom extension exceeding 365 days fails validation', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(5),
    ]);

    $response = $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => 'custom',
            'days' => 366,
        ]);

    $response->assertSessionHasErrors(['days']);
});

test('9. unauthorized agent or manager cannot extend unit', function () {
    $agent = createUser('Agent '.uniqid(), 'agent', null);
    $unit = createTestUnit(['user_id' => $agent->id]);

    $response = $this->actingAs($agent)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '30_days',
        ]);

    $response->assertForbidden();
});

test('10. direct tampering with auto_delete_at parameter in request body is ignored', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(5),
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    // Client attempts to inject arbitrary year 2099 timestamp
    $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '7_days',
            'auto_delete_at' => '2099-01-01 00:00:00',
        ]);

    $freshUnit = Unit::find($unit->id);
    // Server must compute oldDate + 7 days, NOT 2099
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(7)->format('Y-m-d'));
});

test('11. active unit extends from current auto_delete_at preserving remaining days', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(20), // 20 days remaining
    ]);

    $oldDate = $unit->auto_delete_at->copy();

    $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '15_days',
        ]);

    $freshUnit = Unit::find($unit->id);
    // New expiration must be exactly oldDate + 15 days (i.e. now + 35 days)
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe($oldDate->addDays(15)->format('Y-m-d'));
});

test('12. expired unit in grace period is reactivated and extends from now', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => false,
        'auto_delete_at' => now()->subDays(3), // Expired 3 days ago
    ]);

    $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '30_days',
        ]);

    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->is_active)->toBeTrue();
    expect($freshUnit->auto_delete_at->format('Y-m-d'))->toBe(now()->addDays(30)->format('Y-m-d'));
});

test('13. non-existent or permanently deleted unit returns 404', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);

    $response = $this->actingAs($admin)
        ->post('/admin/units/99999999/extend-expiry', [
            'duration_type' => '30_days',
        ]);

    $response->assertNotFound();
});

test('14. auto delete job does not delete unit at old date after extension', function () {
    Setting::setValue('cleanup_deleted_days', '7');
    $admin = createUser('Admin User '.uniqid(), 'admin', null);

    // Unit was expired 8 days ago (past cleanup window)
    $unit = createTestUnit([
        'is_active' => false,
        'auto_delete_at' => now()->subDays(8),
    ]);

    // Admin extends unit by 30 days
    $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '30_days',
        ]);

    // Run AutoDeleteReviewJob
    $job = new AutoDeleteReviewJob;
    $job->handle(app(SitemapService::class));

    // Unit must NOT be deleted because auto_delete_at was updated to future
    $freshUnit = Unit::find($unit->id);
    expect($freshUnit)->not->toBeNull();
    expect($freshUnit->is_active)->toBeTrue();
});

test('15. auto delete job processes unit at its new expiration date', function () {
    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(2),
    ]);

    // Extend unit by 7 days -> new auto_delete_at is now + 9 days
    $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => '7_days',
        ]);

    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->is_active)->toBeTrue();

    // Fast-forward unit auto_delete_at to expired
    $freshUnit->update(['auto_delete_at' => now()->subMinute()]);

    $job = new AutoDeleteReviewJob;
    $job->handle(app(SitemapService::class));

    // Unit must now be deactivated
    expect(Unit::find($unit->id)->is_active)->toBeFalse();
});

test('16. extension confirmation notification contains correct unit name, days, and expiration date', function () {
    Notification::fake();

    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    $agent = createUser('Agent Owner '.uniqid(), 'agent', null);

    $unit = createTestUnit([
        'user_id' => $agent->id,
        'name' => 'شقة فاخرة للتمديد',
        'name_ar' => 'شقة فاخرة للتمديد',
        'name_en' => 'Luxury Apartment For Extension',
        'is_active' => true,
        'auto_delete_at' => now()->addDays(5),
    ]);

    $this->actingAs($admin)
        ->post("/admin/units/{$unit->id}/extend-expiry", [
            'duration_type' => 'custom',
            'days' => 45,
        ]);

    Notification::assertSentTo($agent, UnitExtendedNotification::class, function ($notification) use ($unit) {
        $data = $notification->toArray($unit->user);

        return $data['type'] === 'unit_extended'
            && $data['days'] === 45
            && str_contains($data['message'], 'شقة فاخرة للتمديد')
            && str_contains($data['message_en'], 'Luxury Apartment For Extension')
            && str_contains($data['message'], '45 يوماً');
    });
});
