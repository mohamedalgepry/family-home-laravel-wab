<?php
$resp = file_get_contents('http://127.0.0.1:8000/ar/articles/dummy-real-estate-article-1');
preg_match_all('/<script type="application\/ld\+json">(.*?)<\/script>/s', $resp, $m);
foreach($m[1] as $j) {
    echo $j . "\n";
}
