<?php
$url = 'https://familyhome-co.com/';
$html = file_get_contents($url);
preg_match('/<source media="\(min-width: 641px\)" srcSet="([^"]+)"/', $html, $matches);
if (empty($matches)) {
    preg_match('/<img[^>]+src="([^"]+hero[^"]+)"/', $html, $matches);
}
if (!empty($matches[1])) {
    $imgUrl = $matches[1];
    if (strpos($imgUrl, 'http') === false) {
        $imgUrl = 'https://familyhome-co.com' . $imgUrl;
    }
    echo "Hero URL: $imgUrl\n";
    $imgData = file_get_contents($imgUrl);
    if ($imgData) {
        file_put_contents(__DIR__ . '/hero.webp', $imgData);
        $size = filesize(__DIR__ . '/hero.webp');
        $img = imagecreatefromwebp(__DIR__ . '/hero.webp');
        echo "Size: " . $size . " bytes\n";
        echo "Dimensions: " . imagesx($img) . "x" . imagesy($img) . "\n";
    } else {
        echo "Failed to download image.\n";
    }
} else {
    echo "Hero image not found in HTML.\n";
}
