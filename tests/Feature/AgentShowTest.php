<?php

namespace Tests\Feature;

use App\Domain\Listings\Models\Project;
use App\Domain\Users\Models\AgentProfile;
use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgentShowTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_agent_by_slug(): void
    {
        $user = User::create([
            'name' => 'Ahmed Mahmoud',
            'slug' => 'ahmed-mahmoud',
            'email' => 'ahmed@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'role' => 'agent',
        ]);

        AgentProfile::create([
            'user_id' => $user->id,
            'bio' => 'Experienced real estate advisor in Cairo.',
            'phone' => '01000000000',
            'whatsapp' => '01000000000',
        ]);

        $response = $this->get('/ar/agents/ahmed-mahmoud');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Public/Agents/Show')
            ->has('agent')
            ->has('projects')
            ->where('agent.name', 'Ahmed Mahmoud')
            ->where('agent.slug', 'ahmed-mahmoud')
        );
    }

    public function test_agent_profile_includes_agent_owned_projects(): void
    {
        $user = User::create([
            'name' => 'Project Agent',
            'slug' => 'project-agent',
            'email' => 'project-agent@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'role' => 'agent',
        ]);

        AgentProfile::create(['user_id' => $user->id]);

        Project::create([
            'user_id' => $user->id,
            'name' => 'Agent Project',
            'slug' => 'agent-project',
            'is_active' => true,
        ]);

        $response = $this->get('/ar/agents/project-agent');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('projects.data', 1)
            ->where('projects.data.0.name', 'Agent Project')
            ->where('stats.projects_count', 1)
        );
    }

    public function test_manager_profile_includes_projects_created_by_managed_agents(): void
    {
        $manager = User::create([
            'name' => 'Sales Manager',
            'slug' => 'sales-manager',
            'email' => 'manager@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'role' => 'manager',
        ]);

        AgentProfile::create(['user_id' => $manager->id]);

        $agent = User::create([
            'name' => 'Managed Agent',
            'slug' => 'managed-agent',
            'email' => 'managed@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'role' => 'agent',
            'manager_id' => $manager->id,
        ]);

        Project::create([
            'user_id' => $agent->id,
            'name' => 'Managed Project',
            'slug' => 'managed-project',
            'is_active' => true,
        ]);

        $response = $this->get('/ar/agents/sales-manager');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('projects.data', 1)
            ->where('projects.data.0.name', 'Managed Project')
            ->where('stats.projects_count', 1)
        );
    }

    public function test_can_view_agent_by_numeric_id(): void
    {
        $user = User::create([
            'name' => 'Agent Number Two',
            'slug' => 'agent-two',
            'email' => 'agent2@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'role' => 'agent',
        ]);

        AgentProfile::create([
            'user_id' => $user->id,
        ]);

        $response = $this->get("/ar/agents/{$user->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Public/Agents/Show')
            ->where('agent.id', $user->id)
        );
    }

    public function test_inactive_agent_returns_404(): void
    {
        User::create([
            'name' => 'Inactive Agent',
            'slug' => 'inactive-agent',
            'email' => 'inactive@test.com',
            'password' => bcrypt('password'),
            'is_active' => false,
            'role' => 'agent',
        ]);

        $response = $this->get('/ar/agents/inactive-agent');

        $response->assertStatus(404);
    }
}
