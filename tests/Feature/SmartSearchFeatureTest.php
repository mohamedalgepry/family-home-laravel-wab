<?php

namespace Tests\Feature;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\UnitType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SmartSearchFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_smart_search_merges_filters_in_unit_controller()
    {
        $type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment', 'slug' => 'apt']);
        $area = Area::create(['name_ar' => 'التجمع الخامس', 'name_en' => '5th Settlement', 'slug' => '5th']);

        // Test normal smart search
        $response = $this->get('/ar/units?search=' . urlencode('شقة للبيع في التجمع الخامس بـ 5 مليون'));

        $response->assertStatus(200);
        $response->assertInertia(function ($page) use ($type, $area) {
            $filters = $page->toArray()['props']['filters'];
            
            $this->assertEquals('sale', $filters['transaction']);
            $this->assertEquals($type->id, $filters['type_id']);
            $this->assertEquals($area->id, $filters['area_id']);
            $this->assertEquals(5000000, $filters['price_max']);
            $this->assertEquals('في', trim($filters['search']));
        });
    }

    public function test_smart_search_respects_explicit_filters()
    {
        $type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment', 'slug' => 'apt']);

        // User typed "للبيع" but selected "rent" in the dropdown
        $response = $this->get('/ar/units?search=' . urlencode('شقة للبيع') . '&transaction=rent');

        $response->assertStatus(200);
        $response->assertInertia(function ($page) use ($type) {
            $filters = $page->toArray()['props']['filters'];
            
            $this->assertEquals('rent', $filters['transaction'], 'Explicit transaction overrides smart search');
            $this->assertEquals($type->id, $filters['type_id'], 'Smart search still sets type');
        });
    }
}
