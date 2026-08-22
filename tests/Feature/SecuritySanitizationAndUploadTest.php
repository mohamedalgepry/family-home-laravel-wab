<?php

use App\Domain\Common\Support\Sanitizer;
use App\Http\Requests\Admin\StoreArticleRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;

test('sanitizer removes javascript, vbscript and dangerous links from rich html', function () {
    $dirtyHtml = '
        <p>Text with <a href="javascript:alert(\'xss\')">Dangerous JS Link</a></p>
        <p>Text with <a href="vbscript:msgbox(1)">Dangerous VBScript Link</a></p>
        <p>Text with <a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Data URI Link</a></p>
        <p>Text with <a href="https://familyhome-co.com" target="_blank">Safe External Link</a></p>
        <p>Text with <a href="/articles/real-estate">Safe Internal Link</a></p>
        <p>Text with <a href="mailto:info@familyhome-co.com">Safe Mailto</a></p>
        <p>Text with <a href="tel:+201000000000">Safe Tel</a></p>
    ';

    $cleanHtml = Sanitizer::rich($dirtyHtml);

    // Dangerous links must have href attribute stripped
    expect($cleanHtml)->not->toContain('href="javascript:');
    expect($cleanHtml)->not->toContain('href="vbscript:');
    expect($cleanHtml)->not->toContain('href="data:');

    // Safe links must be preserved
    expect($cleanHtml)->toContain('href="https://familyhome-co.com"');
    expect($cleanHtml)->toContain('rel="noopener noreferrer"');
    expect($cleanHtml)->toContain('href="/articles/real-estate"');
    expect($cleanHtml)->toContain('href="mailto:info@familyhome-co.com"');
    expect($cleanHtml)->toContain('href="tel:+201000000000"');
});

test('sanitizer removes malicious script tags and inline event handlers', function () {
    $maliciousHtml = '<p>Normal text<script>alert("hacked")</script><img src="x" onerror="alert(1)" /><span style="color: red; background: url(javascript:alert(1));">Styled</span></p>';

    $clean = Sanitizer::rich($maliciousHtml);

    expect($clean)->not->toContain('<script>');
    expect($clean)->not->toContain('onerror');
    expect($clean)->not->toContain('javascript:');
    expect($clean)->toContain('color: red');
});

test('image upload validation rejects SVG and dangerous non-image files', function () {
    $rules = (new StoreArticleRequest)->rules();

    // 1. Fake SVG file (potential XSS vector)
    $svgFile = UploadedFile::fake()->create('malicious.svg', 100, 'image/svg+xml');
    $validator = Validator::make(['cover_image' => $svgFile], ['cover_image' => $rules['cover_image']]);
    expect($validator->fails())->toBeTrue();

    // 2. Fake PHP executable file
    $phpFile = UploadedFile::fake()->create('shell.php', 50, 'application/x-php');
    $validator = Validator::make(['cover_image' => $phpFile], ['cover_image' => $rules['cover_image']]);
    expect($validator->fails())->toBeTrue();

    // 3. Fake HTML file
    $htmlFile = UploadedFile::fake()->create('index.html', 50, 'text/html');
    $validator = Validator::make(['cover_image' => $htmlFile], ['cover_image' => $rules['cover_image']]);
    expect($validator->fails())->toBeTrue();
});

test('image upload validation accepts valid JPG, PNG and WebP images within limits', function () {
    $rules = (new StoreArticleRequest)->rules();

    $validJpg = UploadedFile::fake()->image('photo.jpg', 800, 600)->size(1500); // 1.5MB
    $validator = Validator::make(['cover_image' => $validJpg], ['cover_image' => $rules['cover_image']]);
    expect($validator->passes())->toBeTrue();

    $validPng = UploadedFile::fake()->image('graphic.png', 800, 600)->size(2000); // 2MB
    $validator = Validator::make(['cover_image' => $validPng], ['cover_image' => $rules['cover_image']]);
    expect($validator->passes())->toBeTrue();

    $validWebp = UploadedFile::fake()->image('modern.webp', 800, 600)->size(1000); // 1MB
    $validator = Validator::make(['cover_image' => $validWebp], ['cover_image' => $rules['cover_image']]);
    expect($validator->passes())->toBeTrue();
});
