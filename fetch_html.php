<?php
$html = file_get_contents('http://127.0.0.1:8000/ar/projects/investment-project-1');
if (preg_match('/data-page="([^"]+)"/', $html, $matches)) {
    $json = html_entity_decode($matches[1]);
    file_put_contents('data_page.json', $json);
    echo "Saved data_page.json\n";
} else {
    echo "No data-page attribute found\n";
}
