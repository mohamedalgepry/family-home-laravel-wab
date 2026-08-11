<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$p = App\Domain\Listings\Models\Project::with('user.profile')->where('slug', 'investment-project-2')->first();
if (!$p) {
    echo "Project not found\n";
    exit;
}
$res = App\Http\Resources\Public\ProjectPublicResource::make($p)->resolve();
echo "User resolved type: " . get_class($res['user']) . "\n";
echo json_encode($res['user'], JSON_PRETTY_PRINT);
