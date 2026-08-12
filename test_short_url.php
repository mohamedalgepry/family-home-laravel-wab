<?php
$url = 'https://maps.app.goo.gl/wKkt1cHgW5VZBjTKA';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
$res = curl_exec($ch);
if(curl_errno($ch)){
    echo 'Curl error: ' . curl_error($ch);
}
$final_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
echo "FINAL URL: $final_url\n";
file_put_contents('test_curl_output.txt', substr($res, 0, 5000));
