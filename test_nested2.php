<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$project = App\Domain\Listings\Models\Project::with('user.profile')->first();
$res = App\Http\Resources\Public\ProjectPublicResource::make($project)->resolve();
echo json_encode($res['user']);
