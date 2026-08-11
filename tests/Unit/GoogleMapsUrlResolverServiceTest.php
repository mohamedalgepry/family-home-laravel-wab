<?php

namespace Tests\Unit;

use App\Domain\Listings\Services\GoogleMapsUrlResolverService;
use Tests\TestCase;

class GoogleMapsUrlResolverServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new GoogleMapsUrlResolverService();
    }

    public function test_extracts_from_3d_4d_pin()
    {
        $url = 'https://www.google.com/maps/place/SomePlace/@30.0123,31.0456,15z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!8m2!3d30.1!4d31.1';
        $result = $this->service->resolveAndExtract($url);
        
        $this->assertNotNull($result);
        $this->assertEquals('30.1', $result['latitude']);
        $this->assertEquals('31.1', $result['longitude']);
    }

    public function test_extracts_from_query()
    {
        $url = 'https://www.google.com/maps/search/?api=1&query=30.2,31.2';
        $result = $this->service->resolveAndExtract($url);
        
        $this->assertNotNull($result);
        $this->assertEquals('30.2', $result['latitude']);
        $this->assertEquals('31.2', $result['longitude']);
    }

    public function test_extracts_from_center()
    {
        $url = 'https://www.google.com/maps?center=30.3,31.3';
        $result = $this->service->resolveAndExtract($url);
        
        $this->assertNotNull($result);
        $this->assertEquals('30.3', $result['latitude']);
        $this->assertEquals('31.3', $result['longitude']);
    }

    public function test_extracts_from_viewport()
    {
        $url = 'https://www.google.com/maps/@30.4,31.4,15z';
        $result = $this->service->resolveAndExtract($url);
        
        $this->assertNotNull($result);
        $this->assertEquals('30.4', $result['latitude']);
        $this->assertEquals('31.4', $result['longitude']);
    }

    public function test_rejects_invalid_hosts()
    {
        $url = 'https://example.com/maps/@30.4,31.4,15z';
        $result = $this->service->resolveAndExtract($url);
        
        $this->assertNull($result);
    }

    public function test_rejects_invalid_coordinates()
    {
        $url = 'https://www.google.com/maps/@95.4,31.4,15z';
        $result = $this->service->resolveAndExtract($url);
        
        $this->assertNull($result);
    }
}
