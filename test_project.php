<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$project = \App\Domain\Listings\Models\Project::first();
if ($project) {
    echo "First Project Slug: " . $project->slug_ar . "\n";
    $url = "http://127.0.0.1:8000/ar/projects/" . $project->slug_ar;
    echo "Fetching $url ...\n";
    $html = @file_get_contents($url);
    if ($html === false) {
        $error = error_get_last();
        echo "Error: " . $error['message'] . "\n";
    } else {
        echo "Length: " . strlen($html) . "\n";
        file_put_contents('project_page.html', $html);
    }
} else {
    echo "No projects found.\n";
}
