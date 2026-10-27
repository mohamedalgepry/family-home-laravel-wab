<?php

namespace Tests\Feature\Notifications;

use App\Domain\Listings\Notifications\NewProjectCreatedNotification;
use App\Domain\Listings\Notifications\ProjectExpiryWarningNotification;
use App\Domain\Listings\Notifications\ProjectPendingApprovalNotification;
use App\Domain\Listings\Notifications\ProjectPermanentlyDeletedNotification;
use App\Domain\Listings\Notifications\UnitApprovedNotification;
use App\Domain\Listings\Notifications\UnitExpiryNotification;
use App\Domain\Listings\Notifications\UnitExtendedNotification;
use App\Domain\Listings\Notifications\UnitPendingApprovalNotification;
use App\Domain\Listings\Notifications\UnitPermanentlyDeletedNotification;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationServiceOptimizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_listing_notifications_implement_should_queue(): void
    {
        $classes = [
            NewProjectCreatedNotification::class,
            ProjectExpiryWarningNotification::class,
            ProjectPendingApprovalNotification::class,
            ProjectPermanentlyDeletedNotification::class,
            UnitApprovedNotification::class,
            UnitExpiryNotification::class,
            UnitExtendedNotification::class,
            UnitPendingApprovalNotification::class,
            UnitPermanentlyDeletedNotification::class,
        ];

        foreach ($classes as $class) {
            $this->assertTrue(
                is_subclass_of($class, ShouldQueue::class),
                "{$class} must implement ShouldQueue to prevent blocking HTTP requests."
            );
        }
    }

    public function test_notification_pagination_uses_page_specific_cache_keys(): void
    {
        Cache::flush();

        $user = User::create([
            'name' => 'Cache Test User',
            'email' => 'cache@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create 25 notifications to have 2 pages (20 per page)
        for ($i = 1; $i <= 25; $i++) {
            DatabaseNotification::create([
                'id' => (string) Str::uuid(),
                'type' => 'App\\Notifications\\TestNotification',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => ['title' => "Notification {$i}", 'message' => "Message {$i}"],
                'created_at' => now()->subMinutes(30 - $i),
                'updated_at' => now(),
            ]);
        }

        $service = app(NotificationService::class);

        // Fetch page 1
        request()->merge(['page' => 1]);
        $page1 = $service->paginated($user);
        $this->assertTrue(Cache::has("user_{$user->id}_notifications_page_1"));

        // Fetch page 2
        request()->merge(['page' => 2]);
        $page2 = $service->paginated($user);
        $this->assertTrue(Cache::has("user_{$user->id}_notifications_page_2"));

        // Verify page 1 and page 2 are different
        $this->assertCount(20, $page1->items());
        $this->assertCount(5, $page2->items());

        // Invalidate cache
        $service->clearUserCache($user);
        $this->assertFalse(Cache::has("user_{$user->id}_notifications_page_1"));
        $this->assertFalse(Cache::has("user_{$user->id}_notifications_page_2"));
    }

    public function test_remove_entity_notifications_deletes_using_json_path(): void
    {
        $user = User::create([
            'name' => 'Entity Test User',
            'email' => 'entity@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create notifications for unit 99 and unit 100
        $n1 = DatabaseNotification::create([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\UnitNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => ['unit_id' => 99, 'title' => 'Unit 99 alert'],
        ]);

        $n2 = DatabaseNotification::create([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\UnitNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => ['unit_id' => 100, 'title' => 'Unit 100 alert'],
        ]);

        $service = app(NotificationService::class);
        $service->removeEntityNotifications('unit_id', 99);

        $this->assertDatabaseMissing('notifications', ['id' => $n1->id]);
        $this->assertDatabaseHas('notifications', ['id' => $n2->id]);
    }

    public function test_mark_entity_notifications_as_read_updates_using_json_path(): void
    {
        $user = User::create([
            'name' => 'Read Test User',
            'email' => 'read@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $n1 = DatabaseNotification::create([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\UnitNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => ['unit_id' => 42, 'title' => 'Unit 42 alert'],
            'read_at' => null,
        ]);

        $service = app(NotificationService::class);
        $service->markEntityNotificationsAsRead($user, 'unit_id', 42);

        $this->assertNotNull($n1->fresh()->read_at);
    }
}
