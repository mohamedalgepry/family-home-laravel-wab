<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$settings = app(\App\Domain\Listings\Services\SettingsService::class)->getAll();
var_dump($settings['company_whatsapp'] ?? null);
var_dump($settings['whatsapp_number'] ?? null);
var_dump($settings['phone'] ?? null);
