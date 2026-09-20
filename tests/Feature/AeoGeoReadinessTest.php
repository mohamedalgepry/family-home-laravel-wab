<?php

use App\Domain\Listings\Models\Area;
use App\Http\Middleware\DetectBot;

use function Pest\Laravel\get;

/**
 * AEO/GEO (Answer Engine / Generative Engine Optimization) readiness:
 * - AI crawlers must be welcomed in robots.txt and served prerendered HTML
 * - llms.txt must exist and describe the site
 * - JSON-LD must be valid and carry quotable facts (rooms, size, price, FAQs)
 */
it('serves llms.txt with the curated site map for AI engines', function () {
    $response = get('/llms.txt');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/plain; charset=UTF-8');

    $body = $response->getContent();

    expect($body)->toContain('# ')
        ->toContain('/ar/units')
        ->toContain('/ar/projects')
        ->toContain('/ar/areas')
        ->toContain('sitemap.xml')
        ->toContain('EGP');
});

it('welcomes AI answer-engine crawlers in robots.txt', function () {
    $body = get('/robots.txt')->getContent();

    foreach (['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Meta-ExternalAgent', 'CCBot'] as $bot) {
        expect($body)->toContain("User-agent: {$bot}");
    }

    expect($body)->toContain('llms.txt');
});

it('treats AI crawlers as bots eligible for prerendered HTML', function () {
    $middleware = new ReflectionClass(DetectBot::class);
    $signatures = $middleware->getConstant('BOT_SIGNATURES');

    foreach ([
        'gptbot', 'oai-searchbot', 'chatgpt-user', 'claudebot', 'anthropic-ai',
        'perplexitybot', 'google-extended', 'meta-externalagent', 'ccbot', 'amazonbot',
    ] as $signature) {
        expect($signatures)->toContain($signature);
    }
});

it('emits valid JSON-LD on every core public page', function () {
    $unit = createTestUnit(['is_active' => true]);

    foreach (['/ar', '/ar/units', '/ar/units/'.$unit->slug, '/ar/about', '/ar/contact'] as $page) {
        $html = get($page)->getContent();
        preg_match_all('/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s', $html, $matches);

        expect(count($matches[1]))->toBeGreaterThan(0);

        foreach ($matches[1] as $block) {
            $decoded = json_decode(trim($block), true);
            expect($decoded)->not->toBeNull();
            expect($decoded['@context'] ?? '')->toContain('schema.org');
            expect($decoded)->toHaveKey('@type');
        }
    }
});

it('includes quotable unit facts in the RealEstateListing schema', function () {
    $unit = createTestUnit([
        'is_active' => true,
        'price' => 3_200_000,
        'rooms' => 3,
        'bathrooms' => 2,
        'area_sqm' => 165,
    ]);

    $html = get('/ar/units/'.$unit->slug)->getContent();
    preg_match_all('/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s', $html, $matches);

    $listing = null;
    foreach ($matches[1] as $block) {
        $decoded = json_decode(trim($block), true);
        if (($decoded['@type'] ?? '') === 'RealEstateListing') {
            $listing = $decoded;
        }
    }

    expect($listing)->not->toBeNull()
        ->and($listing['numberOfRooms'] ?? null)->toBe(3)
        ->and($listing['numberOfBathroomsTotal'] ?? null)->toBe(2)
        ->and($listing['floorSize']['value'] ?? null)->toEqual(165)
        ->and($listing['floorSize']['unitCode'] ?? null)->toBe('MTK')
        ->and((float) ($listing['offers']['price'] ?? 0))->toEqual(3200000.0)
        ->and($listing['offers']['priceCurrency'] ?? null)->toBe('EGP');
});

it('publishes an enriched RealEstateAgent entity on the home page', function () {
    $html = get('/ar')->getContent();
    preg_match_all('/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s', $html, $matches);

    $agent = null;
    foreach ($matches[1] as $block) {
        $decoded = json_decode(trim($block), true);
        if (($decoded['@type'] ?? '') === 'RealEstateAgent') {
            $agent = $decoded;
        }
    }

    expect($agent)->not->toBeNull()
        ->and($agent['areaServed']['name'] ?? null)->not->toBeNull()
        ->and($agent['address']['addressLocality'] ?? null)->not->toBeNull()
        ->and($agent['address']['addressCountry'] ?? null)->toBe('EG')
        ->and($agent['priceRange'] ?? null)->toBe('EGP');
});

it('renders FAQPage schema for areas that have active FAQs', function () {
    $area = Area::first() ?? Area::create([
        'name_ar' => 'منطقة الاختبار',
        'name_en' => 'Test Area',
        'slug' => 'aeo-test-area',
        'is_active' => true,
    ]);

    if ($area->faqs()->count() === 0) {
        $area->faqs()->create([
            'question_ar' => 'ما متوسط أسعار الشقق هنا؟',
            'question_en' => 'What is the average apartment price here?',
            'answer_ar' => 'يتراوح بين 2 و4 مليون جنيه حسب الموقع والتشطيب.',
            'answer_en' => 'Between 2M and 4M EGP depending on location and finishing.',
            'is_active' => true,
        ]);
    }

    $html = get('/ar/areas/'.$area->slug)->getContent();

    expect($html)->toContain('FAQPage');

    preg_match_all('/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s', $html, $matches);

    $faq = null;
    foreach ($matches[1] as $block) {
        $decoded = json_decode(trim($block), true);
        if (($decoded['@type'] ?? '') === 'FAQPage') {
            $faq = $decoded;
        }
    }

    expect($faq)->not->toBeNull()
        ->and(count($faq['mainEntity'] ?? []))->toBeGreaterThan(0)
        ->and($faq['mainEntity'][0]['@type'] ?? null)->toBe('Question')
        ->and($faq['mainEntity'][0]['acceptedAnswer']['@type'] ?? null)->toBe('Answer');
});
