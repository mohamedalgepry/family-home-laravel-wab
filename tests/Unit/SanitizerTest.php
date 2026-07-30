<?php

use App\Domain\Common\Support\Sanitizer;

it('removes executable markup and unsafe URLs from rich content', function () {
    $html = Sanitizer::rich(
        '<p onclick="alert(1)">Safe</p>'
        .'<a href="javascript:alert(1)">Unsafe link</a>'
        .'<img src="javascript:alert(1)" onerror="alert(1)">'
        .'<script>alert(1)</script>'
    );

    expect($html)
        ->toContain('Safe')
        ->toContain('Unsafe link')
        ->not->toContain('onclick')
        ->not->toContain('javascript:')
        ->not->toContain('<script');
});

it('keeps safe local images and links', function () {
    $html = Sanitizer::rich(
        '<p><a href="https://example.com" class="link">Read</a>'
        .'<img src="/storage/articles/example.webp" alt="Example"></p>'
    );

    expect($html)
        ->toContain('href="https://example.com"')
        ->toContain('src="/storage/articles/example.webp"')
        ->toContain('alt="Example"');
});
