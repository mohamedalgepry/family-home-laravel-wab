<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/ar/projects/investment-project-1', 'GET');
$request->headers->set('X-Inertia', 'true');
$response = $kernel->handle($request);

$json = $response->getContent();
$data = json_decode($json, true);

if ($data) {
    echo "USER DUMP:\n";
    echo json_encode($data['props']['project']['user'] ?? 'No user property', JSON_PRETTY_PRINT);
} else {
    echo "JSON Error: " . json_last_error_msg() . "\n";
    file_put_contents('raw_json.txt', $json);
}
