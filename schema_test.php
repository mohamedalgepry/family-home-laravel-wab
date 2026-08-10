<?php
$urls = [
    '/ar' => 'home',
    '/ar/about' => 'about',
    '/ar/contact' => 'contact',
    '/ar/areas/6th-october' => 'area',
    '/ar/projects' => 'projects_index',
    '/ar/units' => 'units_index',
    '/ar/articles' => 'articles_index',
    '/ar/units/luxury-unit-1' => 'unit',
    '/ar/projects/investment-project-1' => 'project',
    '/ar/articles/dummy-real-estate-article-1' => 'article',
];

function checkUrl($urlPath, $type) {
    $url = 'http://127.0.0.1:8000' . $urlPath;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $resp = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($status !== 200 && $status !== 404) {
        return ["status" => $status, "error" => "HTTP Status $status"];
    }
    
    if (!preg_match_all('/<script type="application\/ld\+json">(.*?)<\/script>/s', $resp, $matches)) {
        return ["status" => $status, "error" => "No JSON-LD script tag found"];
    }
    
    $types = [];
    $allSchemas = [];
    foreach ($matches[1] as $jsonStr) {
        $s = json_decode($jsonStr, true);
        if (!$s) continue;
        
        $allSchemas[] = $s;
        if (!isset($s['@type'])) continue;
        $t = $s['@type'];
        $types[] = $t;
        
        if ($t === 'Article') {
            if (!isset($s['publisher']['logo']['url'])) {
                return ["status" => $status, "error" => "Article missing publisher logo URL"];
            }
        }
        
        if ($t === 'Place') {
            if (isset($s['geo'])) {
                if ($s['geo']['latitude'] == 0 || $s['geo']['longitude'] == 0) {
                     return ["status" => $status, "error" => "Place geo latitude/longitude is 0"];
                }
            }
        }
    }
    
    return [
        "status" => $status,
        "schema_types" => $types,
        "schemas" => $allSchemas,
    ];
}

$results = [];
foreach ($urls as $path => $type) {
    $results[$path] = checkUrl($path, $type);
}

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
