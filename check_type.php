<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$project = App\Domain\Listings\Models\Project::with('user')->first();
$res = App\Http\Resources\Public\ProjectPublicResource::make($project)->resolve();
var_dump(get_class($res['user']));
echo json_encode($res['user']);
