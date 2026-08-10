<?php
$html = file_get_contents('project_html.html');
$jsonStart = strpos($html, '{"component"');
$jsonEnd = strpos($html, '}</script>', $jsonStart);
$json = substr($html, $jsonStart, $jsonEnd - $jsonStart + 1);
$data = json_decode($json, true);
echo 'Project Keys: ' . implode(', ', array_keys($data['props']['project'])) . "\n";
if (isset($data['props']['project']['data'])) {
    echo "Has data key\n";
}
