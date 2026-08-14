<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Admin\UpdateAreaRequest;

$rules = (new UpdateAreaRequest())->rules();

// Test 1: image_path is null (actual PHP null)
$v1 = Validator::make(['name_ar' => 'اختبار', 'name_en' => 'Test', 'image_path' => null], $rules);
echo "Test 1 (null): " . ($v1->fails() ? "FAILED: " . json_encode($v1->errors()->toArray()) : "PASSED") . "\n";

// Test 2: image_path is string 'null' (as FormData might send)
$v2 = Validator::make(['name_ar' => 'اختبار', 'name_en' => 'Test', 'image_path' => 'null'], $rules);
echo "Test 2 ('null' string): " . ($v2->fails() ? "FAILED: " . json_encode($v2->errors()->toArray()) : "PASSED") . "\n";

// Test 3: image_path is empty string ''
$v3 = Validator::make(['name_ar' => 'اختبار', 'name_en' => 'Test', 'image_path' => ''], $rules);
echo "Test 3 (empty string): " . ($v3->fails() ? "FAILED: " . json_encode($v3->errors()->toArray()) : "PASSED") . "\n";

// Test 4: image_path is existing path string 'areas/sheikh-zayed.jpg'
$v4 = Validator::make(['name_ar' => 'اختبار', 'name_en' => 'Test', 'image_path' => 'areas/sheikh-zayed.jpg'], $rules);
echo "Test 4 (existing path string): " . ($v4->fails() ? "FAILED: " . json_encode($v4->errors()->toArray()) : "PASSED") . "\n";
