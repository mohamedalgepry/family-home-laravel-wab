<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

class TestRequest {
    use \App\Http\Requests\Traits\ExtractsCoordinatesFromUrl;
    
    public $data = [];
    
    public function input($key) {
        return $this->data[$key] ?? null;
    }
    
    public function merge($array) {
        $this->data = array_merge($this->data, $array);
    }
    
    public function run($url) {
        $this->data = ['map_url' => $url];
        $this->prepareCoordinatesFromMapUrl();
        return $this->data;
    }
}

$t = new TestRequest();
echo "Test 1: " . json_encode($t->run("https://www.google.com/maps/place/.../@30.1234,31.5678,15z")) . "\n";
echo "Test 2: " . json_encode($t->run("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.60388147575!2d31.11960249842183!3d30.059556291689234!")) . "\n";
echo "Test 3: " . json_encode($t->run("https://www.google.com/maps?q=30.0123,31.0456")) . "\n";
