<?php
$html = file_get_contents('project_html.html');
if (preg_match('/<script\s*data-page[^>]*>(.*?)<\/script>/s', $html, $matches) || preg_match('/&quot;project&quot;:{&quot;data&quot;/', $html)) {
    if (strpos($html, '&quot;project&quot;:{&quot;data&quot;') !== false) {
        echo "PROJECT IS WRAPPED IN DATA!\n";
    } else {
        echo "Project is NOT wrapped in data.\n";
    }
}
$jsonStart = strpos($html, '{"component"');
if ($jsonStart !== false) {
    $jsonEnd = strpos($html, '}</script>', $jsonStart);
    $json = substr($html, $jsonStart, $jsonEnd - $jsonStart + 1);
    $data = json_decode($json, true);
    if (isset($data['props']['project']['data'])) {
        echo "YES! project has 'data' wrapper.\n";
    } else {
        echo "NO wrapper.\n";
    }
}
