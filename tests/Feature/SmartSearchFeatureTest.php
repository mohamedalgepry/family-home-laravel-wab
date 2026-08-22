<?php

namespace Tests\Feature;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\UnitType;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SmartSearchFeatureTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        // SmartSearchService caches unit types and areas.
        // Clear cache between tests so freshly created records are picked up.
        Cache::flush();
    }

    public function test_smart_search_merges_filters_in_unit_controller()
    {
        // Unique names guarantee deterministic resolution regardless of
        // seeded lookup data or test execution order (longest-name-first,
        // word-boundary matching cannot collide with unrelated rows).
        $type = UnitType::create(['name_ar' => 'شقة فاخرة زقزيقة', 'name_en' => 'Zaqzyqa Apartment', 'slug' => 'zaqzyqa-apt']);
        $area = Area::create([
            'name_ar' => 'حي زقزيقة التجريبي',
            'name_en' => 'Zaqzyqa District',
            'slug' => 'zaqzyqa-'.uniqid(),
        ]);

        $response = $this->get('/ar/units?search='.urlencode('شقة فاخرة زقزيقة للبيع في حي زقزيقة التجريبي بـ 5 مليون'));

        $response->assertStatus(200);
        $response->assertInertia(function ($page) use ($type, $area) {
            $filters = $page->toArray()['props']['filters'];

            $this->assertEquals('sale', $filters['transaction'] ?? null);
            $this->assertEquals($type->id, $filters['type_id'] ?? null);
            $this->assertEquals($area->id, $filters['area_id'] ?? null);
            $this->assertEquals(5000000, $filters['price_max'] ?? null);
        });
    }

    public function test_smart_search_respects_explicit_filters()
    {
        $type = UnitType::create(['name_ar' => 'شقة فاخرة زقزيقة', 'name_en' => 'Zaqzyqa Apartment', 'slug' => 'zaqzyqa-apt']);

        // User typed "للبيع" but selected "rent" in the dropdown — explicit must win
        $response = $this->get('/ar/units?search='.urlencode('شقة فاخرة زقزيقة للبيع').'&transaction=rent');

        $response->assertStatus(200);
        $response->assertInertia(function ($page) use ($type) {
            $filters = $page->toArray()['props']['filters'];

            $this->assertEquals('rent', $filters['transaction'] ?? null, 'Explicit transaction must override smart search');
            $this->assertEquals($type->id, $filters['type_id'] ?? null, 'Smart search should still extract unit type');
        });
    }
}
