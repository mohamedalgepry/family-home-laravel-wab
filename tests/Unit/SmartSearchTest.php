<?php

namespace Tests\Unit;

use App\Domain\Listings\DTOs\ParsedSearch;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\FilterResolver;
use App\Domain\Listings\Services\PriceParser;
use App\Domain\Listings\Services\SearchNormalizer;
use App\Domain\Listings\Services\SmartSearchService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SmartSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_normalizer_cleans_arabic_text()
    {
        $normalizer = new SearchNormalizer();

        $this->assertEquals('شقه', $normalizer->normalize('شَقَّة'));
        $this->assertEquals('ا ا ا', $normalizer->normalize('أ إ آ'));
        $this->assertEquals('علي', $normalizer->normalize('على'));
        $this->assertEquals('مدرسه', $normalizer->normalize('مدرسة'));
        $this->assertEquals('تطويل', $normalizer->normalize('تطويـــــل'));
        $this->assertEquals('شقه 5 مليون', $normalizer->normalize('شقة، 5 مليون!'));
        $this->assertEquals('5.5', $normalizer->normalize('5.5'));
    }

    public function test_price_parser_extracts_prices()
    {
        $parser = new PriceParser();

        $result = $parser->parse('شقه ب 5 مليون جنيه');
        $this->assertEquals(5000000, $result['price_max']);
        $this->assertArrayNotHasKey('price_min', $result);
        
        $result = $parser->parse('اقل من 500 الف');
        $this->assertEquals(500000, $result['price_max']);

        $result = $parser->parse('فوق 2 m');
        $this->assertEquals(2000000, $result['price_min']);

        $result = $parser->parse('من 3 الي 5 مليون');
        $this->assertEquals(3000000, $result['price_min']);
        $this->assertEquals(5000000, $result['price_max']);

        $result = $parser->parse('5.5 مليون');
        $this->assertEquals(5500000, $result['price_max']);
        
        // False positive check
        $result = $parser->parse('شقه للبيع في مدينه م نصر');
        $this->assertNull($result);
    }

    public function test_smart_search_service_extracts_filters()
    {
        UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment', 'slug' => 'apt']);
        UnitType::create(['name_ar' => 'توين هاوس', 'name_en' => 'Twin House', 'slug' => 'twin']);
        Area::create(['name_ar' => 'التجمع الخامس', 'name_en' => '5th Settlement', 'slug' => '5th']);
        Area::create(['name_ar' => 'التجمع', 'name_en' => 'Tagamo3', 'slug' => 'tagamo3']);

        $normalizer = new SearchNormalizer();
        $service = new SmartSearchService($normalizer, new PriceParser());

        // Test extracting Area, Type, Transaction, and Price
        $parsed = $service->parse('شقة للبيع في التجمع الخامس بـ 5 مليون');
        
        $this->assertEquals('sale', $parsed->filters['transaction']);
        $this->assertEquals(5000000, $parsed->filters['price_max']);
        $this->assertNotEmpty($parsed->filters['type_id']);
        $this->assertNotEmpty($parsed->filters['area_id']);
        
        // Ensure longest match won: Area should be 'التجمع الخامس' not 'التجمع'
        $area = Area::find($parsed->filters['area_id']);
        $this->assertEquals('التجمع الخامس', $area->name_ar);

        // Ensure clean query contains the remaining words
        $this->assertEquals('في', $parsed->cleanQuery); 
    }

    public function test_filter_resolver_prioritizes_explicit_filters()
    {
        $normalizer = new SearchNormalizer();
        $service = new SmartSearchService($normalizer, new PriceParser());
        $resolver = new FilterResolver($service);

        // User typed "للبيع" but explicitly selected "rent" in the dropdown
        $requestFilters = [
            'search' => 'شقة للبيع',
            'transaction' => 'rent', // Explicit
        ];

        $finalFilters = $resolver->resolve($requestFilters);

        $this->assertEquals('rent', $finalFilters['transaction'], 'Explicit filter should override smart filter');
        $this->assertArrayHasKey('_parsed', $finalFilters);
    }
}
