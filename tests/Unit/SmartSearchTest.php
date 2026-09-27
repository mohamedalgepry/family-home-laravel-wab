<?php

namespace Tests\Unit;

use App\Domain\Listings\DTOs\ParsedSearch;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Services\FilterResolver;
use App\Domain\Listings\Services\PriceParser;
use App\Domain\Listings\Services\SearchNormalizer;
use App\Domain\Listings\Services\SmartSearchService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SmartSearchTest extends TestCase
{
    use DatabaseTransactions;

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
        $this->assertEquals('2 غرف', $normalizer->normalize('٢ غرف'));
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

        $result = $parser->parse('شقه للبيع في مدينه م نصر');
        $this->assertNull($result);
    }

    public function test_smart_search_service_extracts_filters()
    {
        Cache::flush();

        UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment', 'slug' => 'apt']);
        UnitType::create(['name_ar' => 'توين هاوس', 'name_en' => 'Twin House', 'slug' => 'twin']);
        Area::create(['name_ar' => 'التجمع الخامس', 'name_en' => '5th Settlement', 'slug' => '5th']);
        Area::create(['name_ar' => 'التجمع', 'name_en' => 'Tagamo3', 'slug' => 'tagamo3']);

        $normalizer = new SearchNormalizer();
        $service = new SmartSearchService($normalizer, new PriceParser());

        $parsed = $service->parse('شقة للبيع في التجمع الخامس بـ 5 مليون');

        $this->assertEquals('sale', $parsed->filters['transaction']);
        $this->assertEquals(5000000, $parsed->filters['price_max']);
        $this->assertNotEmpty($parsed->filters['type_id']);
        $this->assertNotEmpty($parsed->filters['area_id']);

        $area = Area::find($parsed->filters['area_id']);
        $this->assertEquals('التجمع الخامس', $area->name_ar);
        $this->assertEquals('', $parsed->cleanQuery);
    }

    public function test_smart_search_understands_apartments_in_new_capital()
    {
        Cache::flush();

        $type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment', 'slug' => 'apt-capital']);
        $area = Area::create([
            'name_ar' => 'العاصمة الإدارية الجديدة',
            'name_en' => 'New Administrative Capital',
            'slug' => 'new-administrative-capital',
        ]);

        $normalizer = new SearchNormalizer();
        $service = new SmartSearchService($normalizer, new PriceParser());

        $parsed = $service->parse('شقق بالعاصمة');

        $this->assertSame($type->id, $parsed->filters['type_id']);
        $this->assertSame($area->id, $parsed->filters['area_id']);
        $this->assertSame('', $parsed->cleanQuery);
        $this->assertSame('شقق', $parsed->matchedTerms['unit_type']);
        $this->assertSame('بالعاصمه', $parsed->matchedTerms['area']);
    }

    public function test_smart_search_extracts_rooms_size_payment_and_finishing()
    {
        Cache::flush();

        $type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment', 'slug' => 'apt-smart']);
        $area = Area::create(['name_ar' => 'التجمع الخامس', 'name_en' => '5th Settlement', 'slug' => '5th-smart']);
        $finishing = FinishingType::create(['name_ar' => 'تشطيب كامل', 'name_en' => 'Fully Finished']);

        $service = new SmartSearchService(new SearchNormalizer(), new PriceParser());

        $parsed = $service->parse('شقة 3 غرف مساحة 120 متر تقسيط تشطيب كامل في التجمع الخامس');

        $this->assertSame(3, $parsed->filters['rooms']);
        $this->assertSame(120.0, $parsed->filters['size_min']);
        $this->assertSame(120.0, $parsed->filters['size_max']);
        $this->assertSame('installment', $parsed->filters['payment_method']);
        $this->assertSame($type->id, $parsed->filters['type_id']);
        $this->assertSame($area->id, $parsed->filters['area_id']);
        $this->assertSame($finishing->id, $parsed->filters['finishing_type_id']);
        $this->assertSame('', $parsed->cleanQuery);
    }

    public function test_smart_search_handles_arabic_digits_and_size_range()
    {
        Cache::flush();

        $service = new SmartSearchService(new SearchNormalizer(), new PriceParser());
        $parsed = $service->parse('شقة ٣ غرف من ١٠٠ متر الى ١٥٠ متر');

        $this->assertSame(3, $parsed->filters['rooms']);
        $this->assertSame(100.0, $parsed->filters['size_min']);
        $this->assertSame(150.0, $parsed->filters['size_max']);
        $this->assertSame('', $parsed->cleanQuery);
    }

    public function test_smart_search_understands_common_natural_queries_without_connector_words()
    {
        Cache::flush();

        $type = UnitType::create(['name_ar' => 'شقة', 'name_en' => 'Apartment', 'slug' => 'apt-natural']);
        $area = Area::create(['name_ar' => 'التجمع الخامس', 'name_en' => '5th Settlement', 'slug' => '5th-natural']);

        $service = new SmartSearchService(new SearchNormalizer(), new PriceParser());

        $queries = [
            'شقة في التجمع الخامس للبيع',
            'شقة للبيع في التجمع الخامس',
            '3 غرف شقة في التجمع الخامس ب 5 مليون',
        ];

        foreach ($queries as $query) {
            $parsed = $service->parse($query);

            $this->assertSame($type->id, $parsed->filters['type_id']);
            $this->assertSame($area->id, $parsed->filters['area_id']);
            $this->assertSame('sale', $parsed->filters['transaction']);
        }

        $parsed = $service->parse($queries[2]);
        $this->assertSame(3, $parsed->filters['rooms']);
        $this->assertSame(5000000, $parsed->filters['price_max']);
        $this->assertSame('', $parsed->cleanQuery);
    }

    public function test_filter_resolver_prioritizes_explicit_filters()
    {
        Cache::flush();

        $normalizer = new SearchNormalizer();
        $service = new SmartSearchService($normalizer, new PriceParser());
        $resolver = new FilterResolver($service);

        $requestFilters = [
            'search' => 'شقة للبيع',
            'transaction' => 'rent',
        ];

        $finalFilters = $resolver->resolve($requestFilters);

        $this->assertEquals('rent', $finalFilters['transaction']);
        $this->assertArrayHasKey('_parsed', $finalFilters);
    }
}
