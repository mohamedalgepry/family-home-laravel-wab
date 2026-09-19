<?php
require __DIR__ . '/../vendor/autoload.php';
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

$manager = new ImageManager(new Driver());
// Read an existing image to test mutation
$testImagePath = __DIR__ . '/public/favicon.ico'; // just need any image
if (!file_exists($testImagePath)) {
    // create a dummy image using raw gd
    $gd = imagecreatetruecolor(2000, 2000);
    imagejpeg($gd, __DIR__ . '/scratch/dummy.jpg');
    $testImagePath = __DIR__ . '/scratch/dummy.jpg';
}
$img = $manager->read($testImagePath);
echo "Original width: " . $img->width() . "\n";
$v = $img->scaleDown(480);
echo "Variant width: " . $v->width() . "\n";
echo "Original width after scale: " . $img->width() . "\n";
