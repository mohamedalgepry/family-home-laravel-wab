<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/ar/projects/investment-project-1', 'GET');
$response = $kernel->handle($request);
file_put_contents('html_output.html', $response->getContent());
