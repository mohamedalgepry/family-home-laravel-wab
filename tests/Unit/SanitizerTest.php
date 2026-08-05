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

it('keeps safe color and font-size styles while stripping unsafe ones', function () {
    $html = Sanitizer::rich(
        '<span style="color: #ef4444;">Colored Text</span>'
        .'<span style="font-size: 20px;">Large Text</span>'
        .'<span style="color: expression(alert(1)); font-size: 999px;">Unsafe</span>'
        .'<span style="background-color: red;">No background</span>'
    );

    expect($html)
        ->toContain('color: #ef4444')
        ->toContain('font-size: 20px')
        ->toContain('Colored Text')
        ->toContain('Large Text')
        ->not->toContain('expression')
        ->not->toContain('background-color')
        ->not->toContain('999px');
});
