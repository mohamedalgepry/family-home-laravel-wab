<?php
$ch = curl_init('http://127.0.0.1:8000/ar/about');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Inertia: true']);
$resp = curl_exec($ch);
curl_close($ch);
$d = json_decode($resp, true);
echo json_encode($d['props']['seo_meta']['schema'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

echo "\n\n";

$ch2 = curl_init('http://127.0.0.1:8000/ar/areas/6th-october');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_HTTPHEADER, ['X-Inertia: true']);
$resp2 = curl_exec($ch2);
curl_close($ch2);
$d2 = json_decode($resp2, true);
echo json_encode($d2['props']['seo_meta']['schema'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
