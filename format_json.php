<?php
$json = json_decode(file_get_contents('inertia_payload.json'), true);
file_put_contents('payload_formatted.json', json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "Done\n";
