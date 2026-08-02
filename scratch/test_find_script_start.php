<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$req = Illuminate\Http\Request::create('http://localhost/ar', 'GET');
$res = $kernel->handle($req);
$html = $res->getContent();

$divPos = strpos($html, '<div id="app">');
if ($divPos !== false) {
    $scriptEndPos = strrpos(substr($html, 0, $divPos), '</script>');
    if ($scriptEndPos !== false) {
        $scriptStartPos = strrpos(substr($html, 0, $scriptEndPos), '<script');
        echo "Script tag found from {$scriptStartPos} to {$scriptEndPos}:\n";
        echo substr($html, $scriptStartPos, 150) . "\n";
        
        $tagEnd = strpos($html, '>', $scriptStartPos);
        $jsonContent = substr($html, $tagEnd + 1, $scriptEndPos - ($tagEnd + 1));
        echo "JSON content length: " . strlen($jsonContent) . PHP_EOL;
        $pageObject = json_decode($jsonContent, true);
        echo "JSON decode result: " . ($pageObject ? ("SUCCESS (component: " . $pageObject['component'] . ")") : ("FAILED: " . json_last_error_msg())) . PHP_EOL;
    }
}
