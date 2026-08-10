<?php
$data = json_decode(file_get_contents('payload_inertia.json'), true);
if (is_array($data)) {
    echo array_key_exists('props', $data) ? "HAS PROPS\n" : "NO PROPS\n";
    if (isset($data['props']['project']['user'])) {
        echo json_encode($data['props']['project']['user'], JSON_PRETTY_PRINT);
    } else {
        echo "No project.user found\n";
    }
} else {
    echo "payload_inertia.json is not a valid JSON array. Length: " . strlen(file_get_contents('payload_inertia.json')) . "\n";
}
