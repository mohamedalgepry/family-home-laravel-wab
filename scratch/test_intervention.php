<?php

require __DIR__ . '/../vendor/autoload.php';

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

$manager = new ImageManager(new Driver());
$image = $manager->create(2000, 2000)->fill('ff0000');
echo "Original width: " . $image->width() . "\n";

$variant1 = $image->scaleDown(width: 480);
echo "Variant 1 width: " . $variant1->width() . "\n";
echo "Original width after Variant 1: " . $image->width() . "\n";

$variant2 = $image->scaleDown(width: 960);
echo "Variant 2 width: " . $variant2->width() . "\n";
echo "Original width after Variant 2: " . $image->width() . "\n";
