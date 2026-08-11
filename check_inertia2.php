<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/ar/projects/investment-project-1', 'GET');
$request->headers->set('X-Inertia', 'true');
$request->headers->set('X-Inertia-Version', 'e253b25734d3d5a24cec5223879b83a6');
$response = $kernel->handle($request);

$content = $response->getContent();
$data = json_decode($content, true);
echo json_encode($data['props']['project']['user'] ?? null, JSON_PRETTY_PRINT);
