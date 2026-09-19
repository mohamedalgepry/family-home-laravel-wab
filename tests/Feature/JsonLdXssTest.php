<?php

use App\Domain\Listings\Models\Article;

use function Pest\Laravel\get;

/**
 * JSON-LD structured data is rendered with {!! json_encode(...) !!} inside a
 * <script> tag. Without JSON_HEX_TAG a listing name containing "</script>"
 * would break out of the script context and execute arbitrary HTML (stored XSS).
 */
it('escapes script-breaking characters in unit JSON-LD structured data', function () {
    $payload = '</script><svg onload=alert(1)>';

    $unit = createTestUnit([
        'name' => 'Unit '.$payload,
        'name_ar' => 'وحدة '.$payload,
        'name_en' => 'Unit '.$payload,
        'is_active' => true,
    ]);

    $response = get('/ar/units/'.$unit->slug);

    $response->assertOk();

    $html = $response->getContent();

    // The raw closing-script payload must never appear inside the page head
    expect($html)->not->toContain('</script><svg onload=alert(1)>');
});

it('escapes script-breaking characters in article JSON-LD structured data', function () {
    $payload = '</script><img src=x onerror=alert(2)>';

    $article = Article::create([
        'title' => 'A '.$payload,
        'title_ar' => 'مقال '.$payload,
        'title_en' => 'A '.$payload,
        'content' => 'safe content',
        'content_ar' => 'محتوى',
        'content_en' => 'safe content',
        'slug' => 'jsonld-xss-'.uniqid(),
        'slug_ar' => 'jsonld-xss-ar-'.uniqid(),
        'slug_en' => 'jsonld-xss-en-'.uniqid(),
        'is_published' => true,
    ]);

    $response = get('/ar/articles/'.$article->slug_ar);

    $response->assertOk();

    expect($response->getContent())->not->toContain('</script><img src=x onerror=alert(2)>');
});
