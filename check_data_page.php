<?php
$data = json_decode(file_get_contents('data_page.json'), true);
echo json_encode($data['props']['project']['user'], JSON_PRETTY_PRINT);
