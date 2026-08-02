<?php

$heroPath = __DIR__ . '/../public/images/hero.webp';
$mobilePath = __DIR__ . '/../public/images/hero-mobile.webp';

if (!file_exists($heroPath)) {
    echo "hero.webp not found!\n";
    exit(1);
}

$raw = file_get_contents($heroPath);
$src = imagecreatefromstring($raw);

if (!$src) {
    echo "Failed to load hero.webp!\n";
    exit(1);
}

$w = imagesx($src);
$h = imagesy($src);
$nw = 640;
$nh = (int) round(($h / $w) * $nw);

$dst = imagecreatetruecolor($nw, $nh);
imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);

imagewebp($dst, $mobilePath, 82);

imagedestroy($src);
imagedestroy($dst);

echo "Successfully generated hero-mobile.webp (" . filesize($mobilePath) . " bytes, {$nw}x{$nh})\n";
