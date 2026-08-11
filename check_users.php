<?php
require 'vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
print_r(Illuminate\Support\Facades\Schema::getColumnListing('users'));
print_r(Illuminate\Support\Facades\Schema::getColumnListing('agent_profiles'));
