<?php

namespace Tests\Feature\Messages;

use App\Domain\Listings\Actions\CreateMessageAction;
use App\Domain\Listings\DTOs\CreateMessageData;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\NewMessageNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class MessageCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_message_notification_implements_should_queue(): void
    {
        $this->assertTrue(
            is_subclass_of(NewMessageNotification::class, ShouldQueue::class),
            'NewMessageNotification must implement ShouldQueue to prevent blocking HTTP requests.'
        );
    }

    public function test_public_contact_message_creates_message_and_queues_notification_to_agent(): void
    {
        Notification::fake();

        $agent = User::create([
            'name' => 'Test Agent',
            'email' => 'agent@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        $area = Area::create([
            'name' => 'New Cairo',
            'name_ar' => 'القاهرة الجديدة',
            'name_en' => 'New Cairo',
            'slug' => 'new-cairo',
            'slug_ar' => 'new-cairo-ar',
            'slug_en' => 'new-cairo',
            'is_active' => true,
        ]);

        $type = UnitType::create([
            'name' => 'Apartment',
            'name_ar' => 'شقة',
            'name_en' => 'Apartment',
            'slug' => 'apartment',
            'slug_ar' => 'apartment-ar',
            'slug_en' => 'apartment',
            'is_active' => true,
        ]);

        $unit = new Unit([
            'area_id' => $area->id,
            'type_id' => $type->id,
            'transaction' => 'sale',
            'name' => 'Luxury Flat',
            'name_ar' => 'شقة فاخرة',
            'name_en' => 'Luxury Flat',
            'slug' => 'luxury-flat',
            'slug_ar' => 'luxury-flat-ar',
            'slug_en' => 'luxury-flat',
            'price' => 2500000,
            'description' => 'Great property',
            'description_ar' => 'عقار رائع',
            'description_en' => 'Great property',
        ]);
        $unit->user_id = $agent->id;
        $unit->is_active = true;
        $unit->save();

        $action = app(CreateMessageAction::class);
        $data = CreateMessageData::validateAndCreate([
            'unit_id' => $unit->id,
            'client_name' => 'Omar Ahmed',
            'client_phone' => '01012345678',
            'client_email' => 'omar@example.com',
            'content' => 'Is this unit still available for viewing?',
        ]);

        $message = $action->execute($data);

        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'unit_id' => $unit->id,
            'agent_id' => $agent->id,
            'client_name' => 'Omar Ahmed',
            'status' => 'pending',
        ]);

        Notification::assertSentTo(
            $agent,
            NewMessageNotification::class,
            function ($notification) use ($message) {
                return $notification->message->id === $message->id;
            }
        );
    }

    public function test_general_contact_message_without_unit_assigns_to_admin_and_notifies_admin(): void
    {
        Notification::fake();

        $admin = User::create([
            'name' => 'Platform Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $action = app(CreateMessageAction::class);
        $data = CreateMessageData::validateAndCreate([
            'unit_id' => null,
            'client_name' => 'Mona Youssef',
            'client_phone' => '01123456789',
            'client_email' => 'mona@example.com',
            'content' => 'General partnership inquiry.',
        ]);

        $message = $action->execute($data);

        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'unit_id' => null,
            'agent_id' => $admin->id,
            'client_name' => 'Mona Youssef',
            'status' => 'pending',
        ]);

        Notification::assertSentTo(
            $admin,
            NewMessageNotification::class,
            function ($notification) use ($message) {
                return $notification->message->id === $message->id;
            }
        );
    }

    public function test_submitting_message_with_honeypot_field_fails_validation(): void
    {
        $response = $this->from('/ar/contact')->post('/ar/contact', [
            'client_name' => 'Spam Bot',
            'client_phone' => '01012345678',
            'client_email' => 'spambot@example.com',
            'content' => 'Buy cheap pills online',
            'hp_field' => 'bot_entered_value',
        ]);

        $response->assertRedirect('/ar/contact')
            ->assertSessionHasErrors(['hp_field']);
    }

    public function test_submitting_message_with_excessively_long_phone_fails_validation(): void
    {
        $response = $this->from('/ar/contact')->post('/ar/contact', [
            'client_name' => 'Valid User',
            'client_phone' => str_repeat('1', 30),
            'client_email' => 'valid@example.com',
            'content' => 'Legitimate inquiry content',
        ]);

        $response->assertRedirect('/ar/contact')
            ->assertSessionHasErrors(['client_phone']);
    }
}
