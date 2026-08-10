<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

class Dummy {
    use App\Http\Requests\Traits\ExtractsCoordinatesFromUrl;
    public function test() {
        return $this->extractCoordinates('https://maps.app.goo.gl/LdTTTvXNRbj5brtj8');
    }
}
$d = new Dummy();
print_r($d->test());
