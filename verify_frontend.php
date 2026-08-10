<?php
$html = file_get_contents('http://127.0.0.1:8000/ar/areas/sheikh-zayed');

if (strpos($html, 'GeoCoordinates') !== false) {
    echo "SUCCESS: GeoCoordinates found in HTML!\n";
} else {
    echo "FAIL: GeoCoordinates not found.\n";
}

if (strpos($html, '<meta name="keywords"') !== false) {
    echo "FAIL: meta keywords found!\n";
} else {
    echo "SUCCESS: No meta keywords tag found.\n";
}

if (strpos($html, 'application/ld+json') !== false) {
    echo "SUCCESS: LD-JSON script found.\n";
} else {
    echo "FAIL: No LD-JSON script found.\n";
}
