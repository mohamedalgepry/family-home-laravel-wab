<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/ar/projects/investment-project-1', 'GET');
$request->headers->set('X-Inertia', 'true');
$response = app()->handle($request);
file_put_contents('inertia_payload.json', $response->getContent());
echo "Done\n";
