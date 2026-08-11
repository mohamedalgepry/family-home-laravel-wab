<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$p = App\Domain\Listings\Models\Project::where('slug_en', 'investment-project-2')->orWhere('slug_ar', 'investment-project-2')->orWhere('slug', 'investment-project-2')->first();
echo "User ID: " . $p->user_id . "\n";
