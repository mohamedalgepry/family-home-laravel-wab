<?php

use Illuminate\Support\Facades\Log;

test('CSP reporting accepts a small report and logs only actionable fields', function () {
    Log::spy();

    $response = $this->call(
        'POST',
        '/csp-report',
        [],
        [],
        [],
        ['CONTENT_TYPE' => 'application/csp-report'],
        json_encode(['csp-report' => [
            'violated-directive' => 'img-src',
            'blocked-uri' => 'https://invalid.example/image.png',
            'document-uri' => 'https://familyhome-co.com/ar',
        ], 'unexpected-field' => 'must-not-be-retained'])
    );

    $response->assertNoContent();
    Log::shouldHaveReceived('warning')
        ->withArgs(function ($message, $context = []) {
            return $message === 'CSP Violation Report'
                && ($context['report']['violated-directive'] ?? null) === 'img-src'
                && ! array_key_exists('unexpected-field', $context['report'] ?? []);
        });
});

test('CSP reporting rejects oversized request bodies', function () {
    $body = str_repeat('x', 16_385);

    $response = $this->call(
        'POST',
        '/csp-report',
        [],
        [],
        [],
        ['CONTENT_TYPE' => 'application/csp-report', 'CONTENT_LENGTH' => (string) strlen($body)],
        $body
    );

    $response->assertStatus(413);
});
