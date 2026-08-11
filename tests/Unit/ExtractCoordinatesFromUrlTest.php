<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\Traits\ExtractsCoordinatesFromUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TestRequest extends Request
{
    use ExtractsCoordinatesFromUrl;

    public function testExtract($url)
    {
        return $this->extractCoordinates($url);
    }
}

class ExtractCoordinatesFromUrlTest extends TestCase
{
    public function test_can_extract_from_embed_url()
    {
        $request = new TestRequest();
        $coords = $request->testExtract('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d31.123456!3d30.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDA3JzI0LjQiTiAzMcKwMDcnMjQuNCI!5e0!3m2!1sen!2seg!4v1');
        $this->assertEquals(30.123456, $coords['latitude']);
        $this->assertEquals(31.123456, $coords['longitude']);
    }

    public function test_can_extract_from_at_symbol_url()
    {
        $request = new TestRequest();
        $coords = $request->testExtract('https://www.google.com/maps/@30.123456,31.123456,15z');
        $this->assertEquals(30.123456, $coords['latitude']);
        $this->assertEquals(31.123456, $coords['longitude']);
    }

    public function test_can_extract_from_q_param()
    {
        $request = new TestRequest();
        $coords = $request->testExtract('https://maps.google.com/?q=30.123456,31.123456');
        $this->assertEquals(30.123456, $coords['latitude']);
        $this->assertEquals(31.123456, $coords['longitude']);
    }

    public function test_can_extract_from_query_param()
    {
        $request = new TestRequest();
        $coords = $request->testExtract('https://www.google.com/maps/search/?api=1&query=30.123456,31.123456');
        $this->assertEquals(30.123456, $coords['latitude']);
        $this->assertEquals(31.123456, $coords['longitude']);
    }
    
    public function test_can_extract_from_short_url()
    {
        Http::fake([
            'goo.gl/*' => Http::response('', 302, [
                'Location' => 'https://www.google.com/maps/@29.9611066,30.9295985,15z?entry=ttu',
            ]),
            'google.com/*' => Http::response('<html><body>ok</body></html>', 200),
        ]);

        $request = new TestRequest();
        $coords = $request->testExtract('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');
        // The expanded URL should contain latitude 29.9611... and longitude 30.9295...
        $this->assertNotNull($coords);
        $this->assertEquals(29.9611066, $coords['latitude']);
        $this->assertEquals(30.9295985, $coords['longitude']);

        Http::assertSentCount(2);
    }
}
