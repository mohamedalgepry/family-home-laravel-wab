<?php

use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitImage;
use App\Domain\Listings\Notifications\UnitExpiryNotification;
use App\Domain\Listings\Notifications\UnitPermanentlyDeletedNotification;
use App\Domain\Listings\Services\SitemapService;
use App\Domain\Points\Jobs\AutoDeleteReviewJob;
use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

test('auto delete review job sends warning notification for units approaching expiration and does not send deletion notification', function () {
    Notification::fake();

    $admin = createUser('Admin User '.uniqid(), 'admin', null);
    Setting::setValue('expiry_warning_days', '3');

    // Unit expiring in 2 days (within 3-day warning window)
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->addDays(2),
    ]);

    $job = new AutoDeleteReviewJob;
    $job->handle(app(SitemapService::class));

    // Must send warning notification
    Notification::assertSentTo($admin, UnitExpiryNotification::class, function ($notification) {
        return $notification->type === 'warning';
    });

    // Must NOT send permanent deletion notification
    Notification::assertNotSentTo($admin, UnitPermanentlyDeletedNotification::class);

    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->is_active)->toBeTrue();
});

test('auto delete review job deactivates expired units without sending final deletion notification', function () {
    Notification::fake();

    $admin = createUser('Admin User '.uniqid(), 'admin', null);

    // Unit expired 1 hour ago (within 7-day grace period)
    $unit = createTestUnit([
        'is_active' => true,
        'auto_delete_at' => now()->subHour(),
    ]);

    $job = new AutoDeleteReviewJob;
    $job->handle(app(SitemapService::class));

    $freshUnit = Unit::find($unit->id);
    expect($freshUnit->is_active)->toBeFalse();

    // Must send expired notification
    Notification::assertSentTo($admin, UnitExpiryNotification::class, function ($notification) {
        return $notification->type === 'expired';
    });

    // Must NOT send permanent deletion notification while within grace period
    Notification::assertNotSentTo($admin, UnitPermanentlyDeletedNotification::class);
});

test('auto delete review job permanently deletes units after grace period, sends final deletion notification, and preserves messages and points', function () {
    Notification::fake();
    Storage::fake('public');

    $agent = createUser('Agent AutoDelete '.uniqid(), 'agent', null);
    $admin = createUser('Admin Reviewer '.uniqid(), 'admin', null);
    Setting::setValue('cleanup_deleted_days', '7');

    $fakePath = 'units/test-photo-'.uniqid().'.jpg';
    Storage::disk('public')->put($fakePath, 'fake-image-content');

    // Unit deactivated 8 days ago (past 7-day cleanup window)
    $unit = createTestUnit([
        'user_id' => $agent->id,
        'name' => 'فيلا فاخرة للبيع',
        'name_ar' => 'فيلا فاخرة للبيع',
        'name_en' => 'Luxury Villa For Sale',
        'is_active' => false,
        'auto_delete_at' => now()->subDays(8),
    ]);

    UnitImage::create([
        'unit_id' => $unit->id,
        'path' => $fakePath,
        'thumb_path' => $fakePath,
        'sort_order' => 1,
    ]);

    // Customer lead on this unit
    $message = Message::create([
        'client_name' => 'عميل قديم',
        'client_email' => 'client-old@example.com',
        'client_phone' => '01234567890',
        'content' => 'استفسار قديم',
        'unit_id' => $unit->id,
        'agent_id' => $agent->id,
        'status' => 'pending',
    ]);

    // Points transaction on this unit
    $tx = PointsTransaction::create([
        'manager_id' => $agent->id,
        'unit_id' => $unit->id,
        'points' => -10,
        'type' => 'daily_deduct',
        'notes' => 'Listing creation fee',
        'balance_after' => 90,
        'performed_by' => $agent->id,
        'created_at' => now(),
    ]);

    $job = new AutoDeleteReviewJob;
    $job->handle(app(SitemapService::class));

    // Unit and unit_images must be deleted from DB
    expect(Unit::find($unit->id))->toBeNull();
    expect(UnitImage::where('unit_id', $unit->id)->count())->toBe(0);

    // Image file must be deleted from storage
    Storage::disk('public')->assertMissing($fakePath);

    // Final deletion notification must be sent to the unit owner
    Notification::assertSentTo($agent, UnitPermanentlyDeletedNotification::class, function ($notification) use ($unit) {
        $data = $notification->toArray($unit->user);

        return $data['type'] === 'unit_permanently_deleted'
            && $data['unit_id'] === $unit->id
            && str_contains($data['message'], 'فيلا فاخرة للبيع')
            && str_contains($data['message_en'], 'Luxury Villa For Sale');
    });

    // Customer message must survive with null unit_id
    $freshMessage = Message::find($message->id);
    expect($freshMessage)->not->toBeNull();
    expect($freshMessage->unit_id)->toBeNull();

    // Financial transaction must survive with null unit_id
    $freshTx = PointsTransaction::find($tx->id);
    expect($freshTx)->not->toBeNull();
    expect($freshTx->unit_id)->toBeNull();
});

test('auto delete review job is idempotent and does not send duplicate notifications on retry', function () {
    Notification::fake();

    $agent = createUser('Agent Idempotent '.uniqid(), 'agent', null);
    Setting::setValue('cleanup_deleted_days', '7');

    $unit = createTestUnit([
        'user_id' => $agent->id,
        'is_active' => false,
        'auto_delete_at' => now()->subDays(10),
    ]);

    $job = new AutoDeleteReviewJob;

    // Run first time -> unit is deleted and notification sent once
    $job->handle(app(SitemapService::class));
    expect(Unit::find($unit->id))->toBeNull();

    Notification::assertSentToTimes($agent, UnitPermanentlyDeletedNotification::class, 1);

    // Run second time (simulating job retry) -> unit already deleted, no duplicate notifications
    $job->handle(app(SitemapService::class));

    Notification::assertSentToTimes($agent, UnitPermanentlyDeletedNotification::class, 1);
});
