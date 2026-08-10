<?php

$baseUrl = 'http://127.0.0.1:8000';
$results = [];

function fetchUrl($url, $method = 'GET') {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0); // Don't follow redirects automatically to catch them
    curl_setopt($ch, CURLOPT_HEADER, 1);
    
    // Add custom header to accept Inertia JSON if needed
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: text/html, application/xhtml+xml',
    ]);
    
    $response = curl_exec($ch);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headerStr = substr($response, 0, $headerSize);
    $body = substr($response, $headerSize);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    
    curl_close($ch);
    
    return [
        'status' => $status,
        'contentType' => $contentType,
        'headers' => $headerStr,
        'body' => $body,
    ];
}

// 1. Sitemap Test
$sitemapRes = fetchUrl("$baseUrl/sitemap.xml");
$sitemapLinks = [];
if ($sitemapRes['status'] == 200 && str_contains($sitemapRes['contentType'], 'xml')) {
    preg_match_all('/<loc>(.*?)<\/loc>/', $sitemapRes['body'], $matches);
    $sitemapLinks = $matches[1];
}
$results['sitemap'] = [
    'status' => $sitemapRes['status'],
    'is_xml' => str_contains($sitemapRes['contentType'], 'xml'),
    'has_categories' => str_contains($sitemapRes['body'], 'sitemap-categories.xml'),
    'links' => $sitemapLinks,
];

// 2. Robots Test
$robotsRes = fetchUrl("$baseUrl/robots.txt");
$results['robots'] = [
    'status' => $robotsRes['status'],
    'contains_sitemap' => str_contains($robotsRes['body'], 'Sitemap:'),
    'allows_units' => str_contains($robotsRes['body'], 'Allow: /units/'),
];

// 3. Status Codes Test
$routesToTest = [
    '/ar', '/en', '/ar/units', '/en/units', '/ar/projects', '/en/projects', 
    '/ar/areas/6th-october', '/ar/units/شقة-فاخرة' // assuming these slugs exist
];
$statusCodes = [];
foreach ($routesToTest as $route) {
    $res = fetchUrl($baseUrl . $route);
    $statusCodes[$route] = $res['status'];
}
// Test 404
$res404 = fetchUrl($baseUrl . "/ar/not-found-page-1234");
$statusCodes['404_page'] = $res404['status'];

$results['http_status'] = $statusCodes;

// 4. Data Security Test
$dataSecurityRoutes = ['/ar/units', '/ar/projects'];
$securityResults = [];
foreach ($dataSecurityRoutes as $route) {
    $res = fetchUrl($baseUrl . $route);
    // find inertia payload
    if (preg_match('/data-page="(.*?)"/', $res['body'], $matches)) {
        $json = html_entity_decode($matches[1]);
        $hasEmail = str_contains($json, '"email":') || str_contains($json, 'admin@');
        $hasRole = str_contains($json, '"role":') || str_contains($json, '"permissions":');
        $hasPassword = str_contains($json, '"password":') || str_contains($json, '"password_reset":');
        $securityResults[$route] = [
            'has_email' => $hasEmail,
            'has_role' => $hasRole,
            'has_password' => $hasPassword,
        ];
    } else {
        $securityResults[$route] = 'No Inertia Payload Found';
    }
}
$results['security'] = $securityResults;

// 5. SEO Head Test
$seoResults = [];
foreach (['/ar/units'] as $route) {
    $res = fetchUrl($baseUrl . $route);
    $body = $res['body'];
    $seoResults[$route] = [
        'has_keywords' => str_contains($body, 'name="keywords"'),
        'has_canonical' => str_contains($body, 'rel="canonical"'),
        'has_hreflang_ar' => str_contains($body, 'hreflang="ar"'),
        'has_hreflang_en' => str_contains($body, 'hreflang="en"'),
        'has_x_default' => str_contains($body, 'hreflang="x-default"'),
    ];
}
$results['seo_head'] = $seoResults;

// 6. Pagination Test
$paginationRes1 = fetchUrl($baseUrl . '/ar/units');
$paginationRes2 = fetchUrl($baseUrl . '/ar/units?page=2');
$results['pagination'] = [
    'page1_status' => $paginationRes1['status'],
    'page2_status' => $paginationRes2['status'],
];
if (preg_match('/data-page="(.*?)"/', $paginationRes1['body'], $matches)) {
    $json = html_entity_decode($matches[1]);
    $data = json_decode($json, true);
    $results['pagination']['has_last_page'] = isset($data['props']['units']['meta']['last_page']);
}

// 7. Structured Data JSON-LD
$schemaResults = [];
foreach (['/ar/units', '/ar/projects'] as $route) {
    $res = fetchUrl($baseUrl . $route);
    $schemaResults[$route] = [
        'has_schema' => str_contains($res['body'], 'application/ld+json'),
    ];
}
$results['schema'] = $schemaResults;

echo json_encode($results, JSON_PRETTY_PRINT);
