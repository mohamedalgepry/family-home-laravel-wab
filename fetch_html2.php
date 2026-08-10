<?php
$html = file_get_contents('http://127.0.0.1:8000/ar/projects/investment-project-1');
if (preg_match('/data-page="([^"]+)"/', $html, $matches)) {
    $json = htmlspecialchars_decode($matches[1], ENT_QUOTES);
    $data = json_decode($json, true);
    if ($data) {
        echo json_encode($data['props']['project']['user'], JSON_PRETTY_PRINT);
    } else {
        echo "Failed to decode JSON. Error: " . json_last_error_msg() . "\n";
    }
} else {
    echo "No data-page attribute found\n";
}
