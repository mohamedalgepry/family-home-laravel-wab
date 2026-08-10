<?php
$ch = curl_init('http://127.0.0.1:8000/ar/projects/investment-project-1');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Inertia: true']);
$res = curl_exec($ch);
file_put_contents('payload_inertia.json', $res);
curl_close($ch);
