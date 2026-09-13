<?php

namespace Tests\Unit;

use App\Domain\Assistant\Services\AssistantContactResolver;
use App\Domain\Users\Models\AgentProfile;
use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssistantContactResolverTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        AssistantContactResolver::clearCache();
    }

    public function test_it_formats_company_contact_sections_accurately(): void
    {
        $arSection = AssistantContactResolver::formatCompanyPromptSection('ar');
        $enSection = AssistantContactResolver::formatCompanyPromptSection('en');

        $this->assertNotEmpty($arSection);
        $this->assertNotEmpty($enSection);

        $this->assertStringContainsString('فاميلي هوم', $arSection);
        $this->assertStringContainsString('FAMILY HOME', $enSection);

        // Ensures strict anti-hallucination instruction is embedded
        $this->assertStringContainsString('ممنوع منعاً باتاً اختراع أو توليد أي أرقام هواتف', $arSection);
        $this->assertStringContainsString('NEVER hallucinate or invent fake phone numbers', $enSection);
    }

    public function test_it_resolves_agent_contact_with_profile(): void
    {
        $user = User::create([
            'name' => 'سامح مستشار المبيعات',
            'email' => 'sameh@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        AgentProfile::create([
            'user_id' => $user->id,
            'phone' => '01234567890',
            'whatsapp' => '201234567890',
        ]);

        $resolved = AssistantContactResolver::resolveAgentContact($user->id);

        $this->assertNotNull($resolved);
        $this->assertEquals('سامح مستشار المبيعات', $resolved['name']);
        $this->assertEquals('01234567890', $resolved['phone']);
        $this->assertEquals('201234567890', $resolved['whatsapp']);
    }

    public function test_it_resolves_agent_without_profile_without_fake_numbers(): void
    {
        $user = User::create([
            'name' => 'خالد الوكيل',
            'email' => 'khaled@example.com',
            'password' => bcrypt('secret123'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        $resolved = AssistantContactResolver::resolveAgentContact($user->id);

        $this->assertNotNull($resolved);
        $this->assertEquals('خالد الوكيل', $resolved['name']);
        $this->assertNull($resolved['phone']);
        $this->assertNull($resolved['whatsapp']);
    }

    public function test_it_returns_null_for_invalid_or_empty_user_id(): void
    {
        $this->assertNull(AssistantContactResolver::resolveAgentContact(null));
        $this->assertNull(AssistantContactResolver::resolveAgentContact(0));
        $this->assertNull(AssistantContactResolver::resolveAgentContact(99999999));
    }
}
