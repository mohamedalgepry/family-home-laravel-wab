<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$project = \App\Domain\Listings\Models\Project::with(['area', 'features', 'finishingType', 'images', 'units', 'user.profile'])->first();
if ($project) {
    $resource = new \App\Http\Resources\Public\ProjectPublicResource($project);
    file_put_contents('project_data.json', json_encode($resource->resolve(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Done.\n";
} else {
    echo "No projects.\n";
}
