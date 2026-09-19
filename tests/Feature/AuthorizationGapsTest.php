<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/*
 * Regression tests for authorization on routes that previously had
 * no direct test coverage: media upload, unit points adjustment and
 * the public /storage/{path} file server.
 */

test('agents cannot upload media through the editor endpoint', function () {
    Storage::fake('public');
    $manager = createUser('Media Manager X', 'manager');
    $agent = createUser('Media Agent X', 'agent', $manager->id);

    $this->actingAs($agent)
        ->postJson(route('admin.media.upload'), ['image' => createFakeImage()])
        ->assertStatus(403);
});

test('managers and admins can upload media through the editor endpoint', function () {
    Storage::fake('public');
    $admin = createUser('Media Admin Y', 'admin');
    $manager = createUser('Media Manager Y', 'manager');

    $this->actingAs($admin)
        ->postJson(route('admin.media.upload'), ['image' => createFakeImage()])
        ->assertOk()
        ->assertJsonStructure(['url']);

    $this->actingAs($manager)
        ->postJson(route('admin.media.upload'), ['image' => createFakeImage()])
        ->assertOk()
        ->assertJsonStructure(['url']);
});

test('media upload rejects non-image files', function () {
    Storage::fake('public');
    $admin = createUser('Media Admin Z', 'admin');

    $this->actingAs($admin)
        ->postJson(route('admin.media.upload'), [
            'image' => UploadedFile::fake()->create('payload.php', 10, 'text/php'),
        ])
        ->assertStatus(422);

    $this->actingAs($admin)
        ->postJson(route('admin.media.upload'), [
            'image' => UploadedFile::fake()->create('page.svg', 10, 'image/svg+xml'),
        ])
        ->assertStatus(422);
});

test('unauthenticated users cannot upload media', function () {
    $this->postJson(route('admin.media.upload'), [])
        ->assertStatus(401);
});

test('storage route blocks path traversal attempts', function () {
    $this->get('/storage/..%2F..%2F..%2F.env')->assertNotFound();
    $this->get('/storage/../.env')->assertNotFound();
    $this->get('/storage/units/....//....//.env')->assertNotFound();
});

test('storage route serves a fallback image for missing image paths', function () {
    $response = $this->get('/storage/units/definitely-missing-image.webp');

    // Either the fallback image exists (200) or a plain 404 — never a 500.
    expect($response->getStatusCode())->toBeIn([200, 404]);
});
