<?php
$pngData = file_get_contents(__DIR__ . '/../public/icon.png');
$src = imagecreatefromstring($pngData);
if ($src) {
    $dst = imagescale($src, 48, 48, IMG_BILINEAR_FIXED);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    imagepng($dst, __DIR__ . '/../public/favicon.ico', 9);
    imagedestroy($src);
    imagedestroy($dst);
    echo "Favicon optimized successfully! New size: " . filesize(__DIR__ . '/../public/favicon.ico') . " bytes\n";
} else {
    echo "Failed to load icon.png\n";
}
