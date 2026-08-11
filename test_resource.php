<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$p = App\Domain\Listings\Models\Project::with('user')->first();
$res = App\Http\Resources\Public\ProjectPublicResource::make($p)->resolve();
echo "Dump of user in resolved array:\n";
var_dump($res['user'] ?? null);

echo "Json encoded:\n";
echo json_encode($res['user'] ?? null, JSON_PRETTY_PRINT);
