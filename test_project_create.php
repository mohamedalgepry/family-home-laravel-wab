<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Domain\Listings\DTOs\CreateProjectData;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

$data = [
    'name_en' => 'Test Project',
    'name_ar' => 'Test Project AR',
    'area_id' => 1,
    'description_en' => 'Test',
    'description_ar' => 'Test',
    'is_active' => true,
];

// Create a dummy image
file_put_contents('test.jpg', 'fake image data');
$file = new UploadedFile('test.jpg', 'test.jpg', 'image/jpeg', null, true);

$request = new Request([], $data, [], [], ['images' => [$file]]);

$dto = CreateProjectData::from($data);

$imagePaths = app(\App\Domain\Listings\Actions\StoreUploadedImagesAction::class)->execute($request->file('images', []), 'projects');

$project = app(\App\Domain\Listings\Services\ProjectService::class)->createProject(
    data: $dto,
    userId: 1,
    imagePaths: $imagePaths,
);

var_dump($project->id);
var_dump($project->images->pluck('path')->toArray());

