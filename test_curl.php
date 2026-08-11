<?php
$ch = curl_init('https://maps.app.goo.gl/Rvr6h5i4hp5dT7oA6');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$res = curl_exec($ch);
$info = curl_getinfo($ch);
var_dump($info['url']);
