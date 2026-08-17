<?php

namespace Tests\Unit;

use App\Domain\Listings\Services\GoogleMapsUrlResolverService;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExtractCoordinatesFromUrlTest extends TestCase
{
    private function makeService(): GoogleMapsUrlResolverService
    {
        return app(GoogleMapsUrlResolverService::class);
    }

    public function test_can_extract_from_embed_url()
    {
        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d31.123456!3d30.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzI0LjQiTiAzMcKwMDcnMjQuNCI!5e0!3m2!1sen!2seg!4v1');
        $this->assertNotNull($coords);
        $this->assertEquals(30.123456, (float) $coords['latitude']);
        $this->assertEquals(31.123456, (float) $coords['longitude']);
    }

    public function test_can_extract_from_at_symbol_url()
    {
        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://www.google.com/maps/@30.123456,31.123456,15z');
        $this->assertNotNull($coords);
        $this->assertEquals(30.123456, (float) $coords['latitude']);
        $this->assertEquals(31.123456, (float) $coords['longitude']);
    }

    public function test_can_extract_from_q_param()
    {
        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://maps.google.com/?q=30.123456,31.123456');
        $this->assertNotNull($coords);
        $this->assertEquals(30.123456, (float) $coords['latitude']);
        $this->assertEquals(31.123456, (float) $coords['longitude']);
    }

    public function test_can_extract_from_query_param()
    {
        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://www.google.com/maps/search/?api=1&query=30.123456,31.123456');
        $this->assertNotNull($coords);
        $this->assertEquals(30.123456, (float) $coords['latitude']);
        $this->assertEquals(31.123456, (float) $coords['longitude']);
    }

    public function test_rejects_http_url()
    {
        $service = $this->makeService();
        $coords = $service->resolveAndExtract('http://www.google.com/maps/@30.123456,31.123456,15z');
        $this->assertNull($coords, 'HTTP (non-HTTPS) URLs must be rejected');
    }

    public function test_rejects_non_google_url()
    {
        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://example.com/maps/@30.123456,31.123456,15z');
        $this->assertNull($coords, 'Non-Google URLs must be rejected');
    }

    public function test_rejects_null_island()
    {
        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://www.google.com/maps/@0.0,0.0,15z');
        $this->assertNull($coords, 'Null island coordinates (0,0) must be rejected');
    }

    public function test_can_extract_from_short_url()
    {
        Http::fake([
            'maps.app.goo.gl/*' => Http::response('', 302, [
                'Location' => 'https://www.google.com/maps/@29.9611066,30.9295985,15z?entry=ttu',
            ]),
            'www.google.com/*' => Http::response('<html><body>ok</body></html>', 200),
        ]);

        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');
        // The expanded URL should contain latitude 29.9611... and longitude 30.9295...
        $this->assertNotNull($coords);
        $this->assertEquals(29.9611066, (float) $coords['latitude']);
        $this->assertEquals(30.9295985, (float) $coords['longitude']);
    }

    public function test_rejects_redirect_to_http()
    {
        Http::fake([
            'maps.app.goo.gl/*' => Http::response('', 302, [
                'Location' => 'http://www.google.com/maps/@29.9611066,30.9295985,15z',
            ]),
        ]);

        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');
        $this->assertNull($coords, 'Redirect to HTTP must be blocked');
    }

    public function test_rejects_redirect_to_non_google()
    {
        Http::fake([
            'maps.app.goo.gl/*' => Http::response('', 302, [
                'Location' => 'https://evil.com/maps/@29.9611066,30.9295985,15z',
            ]),
        ]);

        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');
        $this->assertNull($coords, 'Redirect to non-Google domain must be blocked');
    }

    public function test_prioritizes_pin_over_viewport()
    {
        $service = $this->makeService();
        // Here, viewport is @30.0,31.0 but the exact pin is !3d29.5!4d30.5
        $coords = $service->resolveAndExtract('https://www.google.com/maps/@30.0,31.0,15z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d29.5!4d30.5');

        $this->assertNotNull($coords);
        // The PIN should be used, not the viewport
        $this->assertEquals(29.5, (float) $coords['latitude']);
        $this->assertEquals(30.5, (float) $coords['longitude']);
    }

    public function test_rejects_response_exceeding_size_limit()
    {
        Http::fake([
            'maps.app.goo.gl/*' => Http::response(str_repeat('A', 1024 * 1024 * 2), 200, [
                'Content-Length' => 1024 * 1024 * 2, // 2MB
            ]),
        ]);

        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');

        $this->assertNull($coords, 'Response exceeding size limit should throw and return null');
    }

    public function test_rejects_chunked_response_exceeding_size_limit()
    {
        // Fake a response without Content-Length that exceeds 1MB to simulate chunked/streaming bypass attempt
        Http::fake([
            'maps.app.goo.gl/*' => Http::response(str_repeat('A', 1024 * 1024 * 2), 200, []), // Empty headers
        ]);

        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');

        $this->assertNull($coords, 'Chunked response exceeding size limit should be aborted during stream read');
    }

    public function test_extracts_coordinates_from_html_body_if_missing_in_url()
    {
        $html = '<meta property="og:image" content="https://maps.google.com/maps/api/staticmap?center=30.0449792%2C31.3884672&amp;zoom=11&amp;size=900x900">';

        Http::fake([
            'maps.app.goo.gl/*' => Http::response('', 302, [
                'Location' => 'https://www.google.com/maps/place/Some+Place/data=!4m2!3m1!1s0x123:0x456',
            ]),
            'www.google.com/*' => Http::response($html, 200),
        ]);

        $service = $this->makeService();
        $coords = $service->resolveAndExtract('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');

        $this->assertNotNull($coords);
        $this->assertEquals(30.0449792, (float) $coords['latitude']);
        $this->assertEquals(31.3884672, (float) $coords['longitude']);
    }
}
