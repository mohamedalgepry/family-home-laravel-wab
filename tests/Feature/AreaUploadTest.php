<?php

test('root url redirects to locale homepage', function () {
    $response = $this->get('/');

    $response->assertRedirect();
    $this->assertContains($response->headers->get('Location'), [
        url('/ar'),
        url('/en'),
        '/ar',
        '/en',
    ]);
});
