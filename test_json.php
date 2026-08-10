<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Domain\Users\Models\User::first();
$resource = App\Http\Resources\Public\AgentPublicResource::make($user);
echo "jsonSerialize output:\n";
echo json_encode($resource->jsonSerialize(), JSON_PRETTY_PRINT);
