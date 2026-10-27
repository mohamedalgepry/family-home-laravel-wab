<?php

namespace Tests\Feature\Admin;

use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_all_messages(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $agent1 = User::create([
            'name' => 'Agent One',
            'email' => 'agent1@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        $agent2 = User::create([
            'name' => 'Agent Two',
            'email' => 'agent2@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        Message::create([
            'agent_id' => $agent1->id,
            'client_name' => 'Client A',
            'content' => 'Inquiry for Agent 1',
            'status' => 'pending',
        ]);

        Message::create([
            'agent_id' => $agent2->id,
            'client_name' => 'Client B',
            'content' => 'Inquiry for Agent 2',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->get('/admin/messages');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Messages/Index')
            ->has('messages.data', 2)
        );
    }

    public function test_agent_can_only_view_own_assigned_messages(): void
    {
        $agent1 = User::create([
            'name' => 'Agent One',
            'email' => 'agent1@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        $agent2 = User::create([
            'name' => 'Agent Two',
            'email' => 'agent2@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        Message::create([
            'agent_id' => $agent1->id,
            'client_name' => 'Client for Agent 1',
            'content' => 'Inquiry 1',
            'status' => 'pending',
        ]);

        Message::create([
            'agent_id' => $agent2->id,
            'client_name' => 'Client for Agent 2',
            'content' => 'Inquiry 2',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($agent1)->get('/admin/messages');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Messages/Index')
            ->has('messages.data', 1)
            ->where('messages.data.0.client_name', 'Client for Agent 1')
        );
    }

    public function test_agent_cannot_mark_another_agents_message_as_replied_idor_prevention(): void
    {
        $agent1 = User::create([
            'name' => 'Agent One',
            'email' => 'agent1@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        $agent2 = User::create([
            'name' => 'Agent Two',
            'email' => 'agent2@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        $msg = Message::create([
            'agent_id' => $agent2->id,
            'client_name' => 'Client for Agent 2',
            'content' => 'Inquiry for Agent 2',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($agent1)->post("/admin/messages/{$msg->id}/replied");
        $response->assertStatus(403);

        $this->assertEquals('pending', $msg->fresh()->status);
    }

    public function test_non_admin_cannot_delete_message(): void
    {
        $agent = User::create([
            'name' => 'Agent One',
            'email' => 'agent1@test.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        $msg = Message::create([
            'agent_id' => $agent->id,
            'client_name' => 'Client Name',
            'content' => 'Message to delete',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($agent)->delete("/admin/messages/{$msg->id}");
        $response->assertStatus(403);
        $this->assertDatabaseHas('messages', ['id' => $msg->id]);
    }
}
