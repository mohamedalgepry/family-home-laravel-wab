<?php

test('homepage preloads the responsive hero image candidates for LCP', function () {
    $response = $this->get('/ar');

    $response->assertOk();
    $html = $response->getContent();

    preg_match_all(
        '/<link\b(?=[^>]*rel=["\']preload["\'])(?=[^>]*as=["\']image["\'])[^>]*href=["\']([^"\']+)["\'][^>]*>/i',
        $html,
        $matches
    );

    $preloadedImages = $matches[1] ?? [];

    expect($preloadedImages)->toContain('/images/hero-mobile.webp');
    expect($preloadedImages)->toContain('/images/hero.webp');
    expect($preloadedImages)->toHaveCount(2);
});
