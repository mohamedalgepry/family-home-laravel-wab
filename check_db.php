<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$project = App\Domain\Listings\Models\Project::where('slug_en', 'investment-project-1')
    ->orWhere('slug_ar', 'investment-project-1')
    ->orWhere('slug', 'investment-project-1')
    ->first();

if ($project) {
    echo "Project found: " . $project->id . "\n";
    echo "User ID: " . $project->user_id . "\n";
    $user = $project->user;
    if ($user) {
        echo "User Name: " . $user->name . "\n";
        $profile = $user->profile;
        if ($profile) {
            echo "Profile: " . json_encode($profile->toArray()) . "\n";
        } else {
            echo "Profile is NULL\n";
        }
    } else {
        echo "User is NULL\n";
    }
} else {
    echo "Project not found\n";
}
