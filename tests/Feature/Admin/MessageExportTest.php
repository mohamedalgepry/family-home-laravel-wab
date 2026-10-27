<?php

namespace Tests\Feature\Admin;

use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_csv_export_includes_client_fields_and_escapes_formula_injection(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Message with dangerous formula in name and phone starting with +
        Message::create([
            'client_name' => '=HYPERLINK("http://attacker.com")',
            'client_phone' => '+201012345678',
            'client_email' => 'victim@example.com',
            'content' => '@cmd| /C calc',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->get('/admin/messages/export');

        $response->assertStatus(200);
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('attachment;', $response->headers->get('Content-Disposition'));

        $content = $response->streamedContent();

        // Check BOM
        $this->assertStringStartsWith("\xEF\xBB\xBF", $content, 'CSV must start with UTF-8 BOM');

        // Check formula prefix escaping
        $this->assertStringContainsString("'=HYPERLINK", $content);
        $this->assertStringContainsString("'+201012345678", $content);
        $this->assertStringContainsString("'@cmd|", $content);
        $this->assertStringContainsString("victim@example.com", $content);
    }
}
