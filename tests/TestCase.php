<?php

namespace Tests;

use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Disable CSRF verification for all feature tests.
        // This prevents 419 responses when posting without a real session token.
        $this->withoutMiddleware(PreventRequestForgery::class);
    }
}
