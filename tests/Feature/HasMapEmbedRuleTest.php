<?php

use App\Http\Requests\Admin\Concerns\HasMapEmbedRule;
use Illuminate\Support\Facades\Validator;

class DummyRequest
{
    use HasMapEmbedRule;

    public function getRules()
    {
        return ['map_embed_url' => $this->mapEmbedUrlRule()];
    }
}

test('map embed rule accepts empty or null values', function () {
    $request = new DummyRequest;

    $validator = Validator::make(['map_embed_url' => null], $request->getRules());
    $this->assertTrue($validator->passes());

    $validator = Validator::make(['map_embed_url' => ''], $request->getRules());
    $this->assertTrue($validator->passes());
});

test('map embed rule rejects non-url values', function () {
    $request = new DummyRequest;

    $validator = Validator::make(['map_embed_url' => 'not-a-url'], $request->getRules());
    $this->assertFalse($validator->passes());
});

test('map embed rule rejects invalid map domains', function () {
    $request = new DummyRequest;

    $validator = Validator::make(['map_embed_url' => 'https://evil.com/map'], $request->getRules());
    $this->assertFalse($validator->passes());
    $this->assertEquals(__('validation.invalid_map_url'), $validator->errors()->first('map_embed_url'));
});

test('map embed rule accepts valid map domains', function () {
    $request = new DummyRequest;

    $validator = Validator::make(['map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18'], $request->getRules());
    $this->assertTrue($validator->passes());

    $validator = Validator::make(['map_embed_url' => 'https://maps.google.com/maps/embed'], $request->getRules());
    $this->assertTrue($validator->passes());
});
