<?php
$html = file_get_contents('project_html.html');
if (preg_match('/<div[^>]*data-page=["\']({.*?})["\']/is', $html, $matches)) {
    $json = html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8');
    file_put_contents('payload_formatted.json', json_encode(json_decode($json), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Extracted.\n";
} else {
    echo "No data-page found.\n";
}
