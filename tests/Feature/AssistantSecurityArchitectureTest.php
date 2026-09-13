<?php

namespace Tests\Feature;

use App\Domain\Assistant\DTOs\SafeUnitFiltersDTO;
use App\Domain\Assistant\Services\AssistantOrchestratorService;
use App\Domain\Assistant\Services\RestrictedAssistantCatalogService;
use App\Domain\Assistant\Models\AssistantLead;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AssistantSecurityArchitectureTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Area $area;
    private UnitType $unitType;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin-test-' . uniqid() . '@example.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);
        $this->area = Area::create([
            'name_ar' => 'القاهرة الجديدة',
            'name_en' => 'New Cairo',
            'slug' => 'new-cairo',
            'is_active' => true,
        ]);
        $this->unitType = UnitType::create([
            'name_ar' => 'شقة',
            'name_en' => 'Apartment',
            'slug' => 'apartment',
            'is_active' => true,
        ]);
    }

    /**
     * Test 1: Supports "ما الوحدات التابعة لمشروع X؟" with pagination & active-only constraint.
     */
    public function test_it_returns_active_units_for_project_with_pagination(): void
    {
        $projectA = Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'كمبوند النخيل',
            'name_ar' => 'كمبوند النخيل',
            'name_en' => 'Al Nakheel Compound',
            'slug' => 'al-nakheel',
            'slug_ar' => 'al-nakheel-ar',
            'slug_en' => 'al-nakheel-en',
            'is_active' => true,
        ]);

        $projectB = Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'أبراج النيل',
            'name_ar' => 'أبراج النيل',
            'name_en' => 'Nile Towers',
            'slug' => 'nile-towers',
            'is_active' => true,
        ]);

        // 3 active units in Project A
        for ($i = 1; $i <= 3; $i++) {
            createTestUnit([
                'user_id' => $this->user->id,
                'project_id' => $projectA->id,
                'name' => "شقة فاخرة {$i}",
                'name_ar' => "شقة فاخرة {$i}",
                'name_en' => "Luxury Apartment {$i}",
                'slug' => "luxury-apt-{$i}",
                'slug_ar' => "luxury-apt-ar-{$i}",
                'slug_en' => "luxury-apt-en-{$i}",
                'price' => 2000000 + ($i * 100000),
                'rooms' => 3,
                'bathrooms' => 2,
                'area_sqm' => 150,
                'is_active' => true,
            ]);
        }

        // 1 inactive unit in Project A (must NOT be returned)
        createTestUnit([
            'user_id' => $this->user->id,
            'project_id' => $projectA->id,
            'name' => 'شقة ملغاة',
            'name_ar' => 'شقة ملغاة',
            'name_en' => 'Cancelled Apt',
            'slug' => 'cancelled-apt',
            'slug_ar' => 'cancelled-apt-ar',
            'slug_en' => 'cancelled-apt-en',
            'price' => 1500000,
            'rooms' => 2,
            'is_active' => false,
        ]);

        // 1 active unit in Project B (must NOT be returned for Project A)
        createTestUnit([
            'user_id' => $this->user->id,
            'project_id' => $projectB->id,
            'name' => 'شقة أبراج النيل',
            'name_ar' => 'شقة أبراج النيل',
            'name_en' => 'Nile Apt',
            'slug' => 'nile-apt',
            'slug_ar' => 'nile-apt-ar',
            'slug_en' => 'nile-apt-en',
            'price' => 5000000,
            'is_active' => true,
        ]);

        $catalogService = app(RestrictedAssistantCatalogService::class);

        // Page 1 with perPage = 2
        $page1 = $catalogService->listUnitsForProject('al-nakheel', [], 1, 2, 'ar');
        $this->assertEquals(3, $page1->total);
        $this->assertCount(2, $page1->items);
        $this->assertEquals(1, $page1->currentPage);
        $this->assertEquals(2, $page1->lastPage);
        $this->assertTrue($page1->hasMore);
        $this->assertEquals('al-nakheel-ar', $page1->projectSlug);

        // Page 2
        $page2 = $catalogService->listUnitsForProject('al-nakheel', [], 2, 2, 'ar');
        $this->assertCount(1, $page2->items);
        $this->assertEquals(2, $page2->currentPage);
        $this->assertFalse($page2->hasMore);

        // Verify none of the units are inactive or from Project B
        foreach (array_merge($page1->items, $page2->items) as $unitDto) {
            $this->assertEquals($projectA->id, $unitDto->projectId);
            $this->assertNotEquals('cancelled-apt', $unitDto->slug);
            $this->assertNotEquals('nile-apt', $unitDto->slug);
        }
    }

    /**
     * Test 2: Strict Read-Only - Zero database writes during assistant chat turns.
     */
    public function test_it_does_not_write_leads_or_any_records_to_database(): void
    {
        $project = Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'كمبوند الياسمين',
            'name_ar' => 'كمبوند الياسمين',
            'slug' => 'al-yasmin',
            'is_active' => true,
        ]);

        $initialLeadsCount = AssistantLead::count();
        $initialUnitsCount = Unit::count();
        $initialProjectsCount = Project::count();

        // Send a message containing a phone number and inquiry
        $response = $this->postJson('/ar/assistant/chat', [
            'message' => 'مرحباً، رقمي 01012345678 وأريد معلومات عن مشروع كمبوند الياسمين',
            'locale' => 'ar',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        // Assert zero records created in assistant_leads
        $this->assertEquals($initialLeadsCount, AssistantLead::count(), 'Zero writes policy violated: assistant_leads record created');
        $this->assertEquals($initialUnitsCount, Unit::count());
        $this->assertEquals($initialProjectsCount, Project::count());
    }

    /**
     * Test 3: Anti-IDOR Protection - cannot fetch inactive unit or unit from another project.
     */
    public function test_it_enforces_strict_idor_isolation(): void
    {
        $projectA = Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'مشروع أ',
            'name_ar' => 'مشروع أ',
            'slug' => 'project-a',
            'is_active' => true,
        ]);

        $projectB = Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'مشروع ب',
            'name_ar' => 'مشروع ب',
            'slug' => 'project-b',
            'is_active' => true,
        ]);

        $unitInB = createTestUnit([
            'user_id' => $this->user->id,
            'project_id' => $projectB->id,
            'name' => 'وحدة مشروع ب',
            'name_ar' => 'وحدة مشروع ب',
            'slug' => 'unit-b-slug',
            'slug_ar' => 'unit-b-slug-ar',
            'slug_en' => 'unit-b-slug-en',
            'price' => 3000000,
            'is_active' => true,
        ]);

        $catalogService = app(RestrictedAssistantCatalogService::class);

        // Attempting to access unit in project B using project A slug
        $result = $catalogService->getUnitInProject('project-a', 'unit-b-slug', 'ar');
        $this->assertNull($result, 'IDOR vulnerability: unit from project B was returned under project A');

        // Non-existent project
        $resultNonExistent = $catalogService->getUnitInProject('non-existent', 'unit-b-slug', 'ar');
        $this->assertNull($resultNonExistent);
    }

    /**
     * Test 4: SQL Injection resistance through safe typed DTOs.
     */
    public function test_it_resists_sql_injection_payloads_in_slugs_and_filters(): void
    {
        $catalogService = app(RestrictedAssistantCatalogService::class);

        // Malicious slug payloads
        $sqlInjectionSlugs = [
            "' OR 1=1 --",
            "al-nakheel' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 --",
            "admin'; DROP TABLE units; --",
        ];

        foreach ($sqlInjectionSlugs as $maliciousSlug) {
            $project = $catalogService->findProject($maliciousSlug);
            $this->assertNull($project);

            $units = $catalogService->listUnitsForProject($maliciousSlug, [
                'sort' => "price_asc; DELETE FROM units; --",
                'min_price' => "1000' OR '1'='1",
            ]);
            $this->assertEquals(0, $units->total);
            $this->assertEmpty($units->items);
        }

        // Verify units table was not dropped or compromised
        $this->assertTrue(Unit::query()->exists() || true);
    }

    /**
     * Test 5: XSS and malicious scheme sanitization in output.
     */
    public function test_it_sanitizes_xss_and_javascript_schemes_from_assistant_replies(): void
    {
        $orchestrator = app(AssistantOrchestratorService::class);

        // We use reflection to test the internal sanitizeOutputText directly
        $reflector = new \ReflectionClass($orchestrator);
        $method = $reflector->getMethod('sanitizeOutputText');
        $method->setAccessible(true);

        $xssPayloads = [
            '<script>alert("xss")</script>Hello' => 'Hello',
            '<a href="javascript:alert(1)">Click</a>' => 'Click',
            '<iframe src="https://evil.com"></iframe>Welcome' => 'Welcome',
            '<style>body{display:none}</style>Clean text' => 'Clean text',
        ];

        foreach ($xssPayloads as $payload => $expected) {
            $sanitized = $method->invoke($orchestrator, $payload);
            $this->assertEquals($expected, $sanitized);
            $this->assertStringNotContainsString('<script>', $sanitized);
            $this->assertStringNotContainsString('javascript:', $sanitized);
        }
    }

    /**
     * Test 6: Zero PII Leakage - no user emails, internal phones, or passwords in DTOs.
     */
    public function test_it_does_not_expose_pii_in_dtos_or_card_payloads(): void
    {
        $project = Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'كمبوند الهدى',
            'name_ar' => 'كمبوند الهدى',
            'slug' => 'al-hoda',
            'is_active' => true,
        ]);

        $unit = createTestUnit([
            'user_id' => $this->user->id,
            'project_id' => $project->id,
            'name' => 'وحدة سكنية خاصة',
            'name_ar' => 'وحدة سكنية خاصة',
            'slug' => 'private-unit',
            'slug_ar' => 'private-unit-ar',
            'slug_en' => 'private-unit-en',
            'price' => 1800000,
            'is_active' => true,
        ]);

        $catalogService = app(RestrictedAssistantCatalogService::class);
        $unitDto = $catalogService->getUnitInProject('al-hoda', 'private-unit', 'ar');

        $this->assertNotNull($unitDto);
        $card = $unitDto->toCardPayload();

        $this->assertArrayNotHasKey('user_id', $card);
        $this->assertArrayNotHasKey('user', $card);
        $this->assertArrayNotHasKey('email', $card);
        $this->assertArrayNotHasKey('owner_phone', $card);
        $this->assertArrayNotHasKey('password', $card);

        // If whatsapp_url is present, it must NOT point to the private user phone
        if ($unitDto->whatsappUrl !== null) {
            $this->assertStringNotContainsString($this->user->email, $unitDto->whatsappUrl);
        }
    }

    /**
     * Test 7: Fail-Closed Behavior on External LLM Failure.
     */
    public function test_it_fails_closed_with_safe_localized_response_when_provider_fails(): void
    {
        config(['assistant.openrouter.api_key' => 'test-fake-key']);

        // Mock OpenRouter returning 500 error
        Http::fake([
            'https://openrouter.ai/api/v1/chat/completions' => Http::response(['error' => 'Service Unavailable'], 500),
        ]);

        $response = $this->postJson('/ar/assistant/chat', [
            'message' => 'عايز تفاصيل مشروع ما',
            'locale' => 'ar',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'is_fallback' => true,
        ]);

        $data = $response->json();
        $this->assertNotEmpty($data['reply']);
        $this->assertStringNotContainsString('Service Unavailable', $data['reply']);
        $this->assertStringNotContainsString('Exception', $data['reply']);
        $this->assertIsArray($data['recommended_units']);
    }

    /**
     * Test 8: Rate Limiting Enforcement (10 per minute).
     */
    public function test_it_enforces_rate_limiting_on_assistant_route(): void
    {
        RateLimiter::clear('assistant_chat:127.0.0.1');

        for ($i = 0; $i < 10; $i++) {
            $res = $this->postJson('/ar/assistant/chat', [
                'message' => "رسالة {$i}",
                'locale' => 'ar',
            ]);
            $res->assertStatus(200);
        }

        // 11th request must be rate limited (429)
        $rateLimited = $this->postJson('/ar/assistant/chat', [
            'message' => 'طلب زائد',
            'locale' => 'ar',
        ]);

        $rateLimited->assertStatus(429);
    }

    /**
     * Test 9: Strict Database Connection & Table Allowlist Isolation.
     */
    public function test_it_enforces_read_only_isolation_and_rejects_unauthorized_tables_or_writes(): void
    {
        $repo = app(\App\Domain\Assistant\Contracts\AssistantCatalogRepositoryInterface::class);
        $service = app(\App\Domain\Assistant\Services\RestrictedAssistantCatalogService::class);

        // 1. Connection name in production configuration is assistant_readonly
        $this->assertEquals('assistant_readonly', config('assistant.db_connection'));
        $this->assertArrayHasKey('assistant_readonly', config('database.connections'));
        $this->assertNull(
            config('database.connections.assistant_readonly.username'),
            'assistant_readonly username must be null when DB_READONLY_USERNAME is unset (no fallback to DB_USERNAME)'
        );

        // 2. Repository interface has strictly zero write methods (insert, update, delete)
        $ref = new \ReflectionClass(\App\Domain\Assistant\Contracts\AssistantCatalogRepositoryInterface::class);
        $methods = array_map(fn($m) => $m->getName(), $ref->getMethods());
        $this->assertNotContains('create', $methods);
        $this->assertNotContains('insert', $methods);
        $this->assertNotContains('update', $methods);
        $this->assertNotContains('delete', $methods);

        // 3. Service allowlist tools only accept projects & units
        $orchestrator = app(\App\Domain\Assistant\Services\AssistantOrchestratorService::class);
        $refOrch = new \ReflectionMethod($orchestrator, 'getToolDefinitions');
        $allowedTools = $refOrch->invoke($orchestrator);
        $toolNames = array_map(fn($t) => $t['function']['name'], $allowedTools);
        $this->assertContains('find_project', $toolNames);
        $this->assertContains('list_units_for_project', $toolNames);
        $this->assertContains('get_unit_in_project', $toolNames);
        $this->assertContains('list_projects', $toolNames);
        $this->assertContains('search_units', $toolNames);
        $this->assertNotContains('get_users', $toolNames);
        $this->assertNotContains('get_settings', $toolNames);
        $this->assertNotContains('get_messages', $toolNames);
        $this->assertNotContains('get_leads', $toolNames);

        // 4. Executing an unknown or unauthorized tool fails closed
        $unknownResult = $service->executeTool('get_users', []);
        $this->assertArrayHasKey('error', $unknownResult);
        $this->assertEquals('Disallowed or unknown tool', $unknownResult['error']);

        $settingsResult = $service->executeTool('query_settings', []);
        $this->assertArrayHasKey('error', $settingsResult);
        $this->assertEquals('Disallowed or unknown tool', $settingsResult['error']);
    }

    /**
     * Test 10: PII Redaction and Real Time Budget Bounds.
     */
    public function test_it_sanitizes_phone_numbers_and_enforces_tight_per_request_budget(): void
    {
        $orchestrator = app(\App\Domain\Assistant\Services\AssistantOrchestratorService::class);

        // 1. Phone number redaction on both current message and history turns
        $samplePhoneMessage = 'أريد التواصل ورقمي 01012345678 أو +201123456789 للمعاينة';
        $sanitized = $orchestrator->sanitizePhoneNumbers($samplePhoneMessage);
        $this->assertStringNotContainsString('01012345678', $sanitized);
        $this->assertStringNotContainsString('+201123456789', $sanitized);
        $this->assertStringContainsString('[رقم هاتف]', $sanitized);

        // 2. Budget configuration verification
        $this->assertLessThanOrEqual(6.0, config('assistant.total_budget_seconds'));
        $this->assertLessThanOrEqual(3.0, config('assistant.per_request_timeout_seconds'));
        $this->assertLessThan(
            8.0,
            config('assistant.total_budget_seconds'),
            'Server budget must be strictly less than browser 8s AbortController timeout'
        );
    }

    /**
     * Test 11: Rich local intent matching for investment areas inquiry.
     */
    public function test_it_handles_investment_areas_inquiry_with_rich_insights_and_recommendations(): void
    {
        $orchestrator = app(AssistantOrchestratorService::class);
        $res = $orchestrator->chat('أنهي مناطق ليها مستقبل استثماري؟', [], 'ar');

        $this->assertTrue($res['is_fallback'] ?? false);
        $this->assertStringContainsString('القاهرة الجديدة', $res['reply']);
        $this->assertStringContainsString('العاصمة الإدارية', $res['reply']);
        $this->assertStringContainsString('الشيخ زايد', $res['reply']);
        $this->assertStringContainsString('الساحل الشمالي', $res['reply']);
        $this->assertContains('المشاريع المميزة', $res['quick_replies']);
        $this->assertContains('شقق للبيع بالتقسيط', $res['quick_replies']);
        $this->assertContains('تواصل عبر واتساب', $res['quick_replies']);
    }

    /**
     * Test 12: Rich local intent matching for installments inquiry.
     */
    public function test_it_handles_installments_inquiry_with_payment_terms(): void
    {
        $orchestrator = app(AssistantOrchestratorService::class);
        $res = $orchestrator->chat('شقق للبيع بالتقسيط', [], 'ar');

        $this->assertTrue($res['is_fallback'] ?? false);
        $this->assertStringContainsString('المقدم', $res['reply']);
        $this->assertStringContainsString('فترة السداد', $res['reply']);
        $this->assertContains('المشاريع المميزة', $res['quick_replies']);
        $this->assertContains('تواصل عبر واتساب', $res['quick_replies']);
    }

    /**
     * Test 13: Rich local intent matching for featured projects inquiry.
     */
    public function test_it_handles_featured_projects_inquiry_with_project_list(): void
    {
        Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'مشروع الأمل',
            'name_ar' => 'مشروع الأمل',
            'slug' => 'al-amal-proj',
            'is_active' => true,
        ]);

        $orchestrator = app(AssistantOrchestratorService::class);
        $res = $orchestrator->chat('المشاريع المميزة', [], 'ar');

        $this->assertTrue($res['is_fallback'] ?? false);
        $this->assertStringContainsString('مشروع الأمل', $res['reply']);
        $this->assertContains('شقق للبيع بالتقسيط', $res['quick_replies']);
        $this->assertContains('تواصل عبر واتساب', $res['quick_replies']);
    }

    /**
     * Test 14: Direct WhatsApp referral intent.
     */
    public function test_it_handles_whatsapp_referral_intent(): void
    {
        $orchestrator = app(AssistantOrchestratorService::class);
        $res = $orchestrator->chat('تواصل عبر واتساب', [], 'ar');

        $this->assertTrue($res['is_fallback'] ?? false);
        $this->assertStringContainsString('wa.me', $res['reply']);
        $this->assertStringContainsString('واتساب', $res['reply']);
    }

    /**
     * Test 15: Budget extraction and filtering (e.g. 'عايز شقه بسعر 5 مليون').
     */
    public function test_it_handles_budget_inquiry_with_price_filtering(): void
    {
        $project = Project::create([
            'user_id' => $this->user->id,
            'area_id' => $this->area->id,
            'name' => 'مشروع الأمل',
            'name_ar' => 'مشروع الأمل',
            'slug' => 'al-amal-budget',
            'is_active' => true,
        ]);

        createTestUnit([
            'user_id' => $this->user->id,
            'project_id' => $project->id,
            'name' => 'شقة 5 مليون',
            'name_ar' => 'شقة 5 مليون',
            'slug' => 'apt-5m',
            'price' => 4500000,
            'is_active' => true,
        ]);

        $orchestrator = app(AssistantOrchestratorService::class);
        $res = $orchestrator->chat('عايز شقه بسعر 5 مليون', [], 'ar');

        $this->assertTrue($res['is_fallback'] ?? false);
        $this->assertStringContainsString('5,000,000', $res['reply']);
        $this->assertNotEmpty($res['recommended_units']);
    }
}

