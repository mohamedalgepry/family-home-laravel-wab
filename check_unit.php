<?php
$html = file_get_contents('unit_html.html');
if (strpos($html, '"unit":{"id"') !== false || strpos($html, '&quot;unit&quot;:{&quot;id&quot;') !== false) {
    echo "Unit unwrapped properly\n";
} else {
    echo "Wrapper still present or something else\n";
}
