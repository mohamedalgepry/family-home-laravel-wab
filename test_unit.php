<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Domain\Users\Models\User::where('role', 'admin')->first();
if (!$user) die("No admin user found.\n");

$data = App\Domain\Listings\DTOs\CreateUnitData::from([
    'name_en' => 'Test Unit',
    'name_ar' => 'وحدة تجريبية',
    'type_id' => 1,
    'area_id' => 1,
    'transaction' => 'sale',
    'price' => 1000
]);

try {
    app(App\Domain\Listings\Services\UnitService::class)->createUnit($data, $user);
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo "ERROR: " . get_class($e) . " - " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine() . "\n";
}
