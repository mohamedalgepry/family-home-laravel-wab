<?php

$opts = [
    'http' => [
        'method' => 'GET',
        'header' => 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    ],
];
$context = stream_context_create($opts);
$css = file_get_contents('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap', false, $context);

$weights = [400, 500, 600, 700];
$dir = __DIR__.'/public/fonts/cairo/';
if (! is_dir($dir)) {
    mkdir($dir, 0755, true);
}

// Just regex out the Arabic ones or all for simplicity, but wait, the CSS has many unicode ranges.
// We will just fetch the arabic ones or all woff2 and save them locally.
// Actually, it's easier to just use standard links for Cairo fonts woff2 if we can find them,
// but the css contains url(https://...).
$cssModified = $css;
preg_match_all('/url\((https:\/\/[^\)]+)\)/', $css, $matches);
$i = 1;
foreach ($matches[1] as $url) {
    $fontData = file_get_contents($url, false, $context);
    $filename = 'cairo-'.$i.'.woff2';
    file_put_contents($dir.$filename, $fontData);
    $cssModified = str_replace($url, '/fonts/cairo/'.$filename, $cssModified);
    $i++;
}

file_put_contents(__DIR__.'/cairo-fonts.css', $cssModified);
echo 'Fonts downloaded.';
