<?php

use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Services\UnitService;
use App\Domain\Users\Models\User;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$user = User::where('role', 'admin')->first();
if (! $user) {
    exit("No admin user found.\n");
}

$data = CreateUnitData::from([
    'name_en' => 'Test Unit',
    'name_ar' => 'وحدة تجريبية',
    'type_id' => 1,
    'area_id' => 1,
    'transaction' => 'sale',
    'price' => 1000,
]);

try {
    app(UnitService::class)->createUnit($data, $user);
    echo "SUCCESS\n";
} catch (Exception $e) {
    echo 'ERROR: '.get_class($e).' - '.$e->getMessage().' in '.$e->getFile().' on line '.$e->getLine()."\n";
}
