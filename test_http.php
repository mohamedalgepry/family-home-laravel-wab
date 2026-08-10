<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/ar/projects/investment-project-1', 'GET');
$request->headers->set('X-Inertia', 'true');
$response = $kernel->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: \n";
echo json_encode(json_decode($response->getContent(), true)['props']['project']['user'], JSON_PRETTY_PRINT);
$kernel->terminate($request, $response);
