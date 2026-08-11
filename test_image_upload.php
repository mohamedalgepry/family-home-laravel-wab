<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$request = new \Illuminate\Http\Request();
$request->files->set('images', [new \Illuminate\Http\UploadedFile('tests/Feature/test.jpg', 'test.jpg', 'image/jpeg', null, true)]);

$paths = app(\App\Domain\Listings\Actions\StoreUploadedImagesAction::class)->execute($request->file('images', []), 'projects');
var_dump($paths);
