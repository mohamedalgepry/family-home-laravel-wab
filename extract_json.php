<?php
$html = file_get_contents('project_html.html');
if (preg_match('/data-page="([^"]+)"/', $html, $matches)) {
    $json = html_entity_decode($matches[1]);
    file_put_contents('inertia_page.json', json_encode(json_decode($json), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Extracted.\n";
} else {
    echo "No data-page found.\n";
}
