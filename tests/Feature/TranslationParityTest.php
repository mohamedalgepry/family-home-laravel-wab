<?php

/**
 * Every translation key must exist in BOTH ar and en. A key missing from one
 * locale renders as the raw key string in the UI (e.g. 'sidebar_assistant_leads'
 * showed raw in the English admin sidebar until fixed).
 */
function flattenTranslationKeys(array $arr, string $prefix = ''): array
{
    $keys = [];
    foreach ($arr as $k => $v) {
        $full = $prefix === '' ? (string) $k : $prefix.'.'.$k;
        if (is_array($v)) {
            $keys = array_merge($keys, flattenTranslationKeys($v, $full));
        } else {
            $keys[] = $full;
        }
    }

    return $keys;
}

function loadTranslationKeys(string $locale): array
{
    $result = [];
    foreach (glob(base_path("lang/{$locale}/*.php")) as $file) {
        $name = basename($file, '.php');
        $arr = include $file;
        if (is_array($arr)) {
            $result[$name] = flattenTranslationKeys($arr);
        }
    }

    return $result;
}

test('ar and en translation files contain the same keys', function () {
    $ar = loadTranslationKeys('ar');
    $en = loadTranslationKeys('en');

    expect(array_keys($ar))->toEqualCanonicalizing(
        array_keys($en),
        'ar and en must have the same translation files'
    );

    $problems = [];

    foreach ($ar as $file => $keys) {
        $missing = array_diff($keys, $en[$file] ?? []);
        foreach ($missing as $key) {
            $problems[] = "en/{$file}.php missing: {$key}";
        }
    }

    foreach ($en as $file => $keys) {
        $missing = array_diff($keys, $ar[$file] ?? []);
        foreach ($missing as $key) {
            $problems[] = "ar/{$file}.php missing: {$key}";
        }
    }

    expect($problems)->toBeEmpty(
        "Translation keys out of sync:\n".implode("\n", $problems)
    );
});
