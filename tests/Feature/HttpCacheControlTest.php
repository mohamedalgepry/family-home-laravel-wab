<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;

test('it bypasses public cache and sets no-cache on contact page', function () {
    $response = $this->get('/ar/contact');

    $response->assertOk();
    $response->assertHeader('Cache-Control', 'no-cache, private');
    $response->assertHeader('Vary', 'X-Inertia, Accept');
});

test('it bypasses public cache and sets no-cache on single unit detail page with form', function () {
    $user = createUser('Agent', 'agent', null);
    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    $unit = Unit::create([
        'name' => 'وحدة تجريبية',
        'name_ar' => 'وحدة تجريبية',
        'name_en' => 'Test Unit',
        'slug' => 'test-unit-slug',
        'user_id' => $user->id,
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 100000,
    ]);

    $response = $this->get('/ar/units/'.$unit->slug);

    $response->assertOk();
    $response->assertHeader('Cache-Control', 'no-cache, private');
    $response->assertHeader('Vary', 'X-Inertia, Accept');
});

test('it sets public Cache-Control on unit listing search page without forms', function () {
    $response = $this->get('/ar/units');

    $response->assertOk();
    $this->assertStringContainsString('public', $response->headers->get('Cache-Control'));
    $response->assertHeader('Vary', 'X-Inertia, Accept');
});

test('it sets public Cache-Control on about page', function () {
    $response = $this->get('/ar/about');

    $response->assertOk();
    $this->assertStringContainsString('public', $response->headers->get('Cache-Control'));
    $response->assertHeader('Vary', 'X-Inertia, Accept');
});

test('contact form submission succeeds without csrf errors', function () {
    $response = $this->post('/ar/contact', [
        'client_name' => 'Test Client',
        'client_phone' => '01012345678',
        'content' => 'Test inquiry message',
    ]);

    $response->assertSessionHasNoErrors();
});
