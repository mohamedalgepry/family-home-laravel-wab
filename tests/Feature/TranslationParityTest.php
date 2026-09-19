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

/**
 * Extract top-level object keys from a frontend locale dictionary
 * (resources/js/Utils/locales/{ar,en}.js). Simple regex is enough because
 * the files are flat "key: 'value'," dictionaries.
 */
function loadFrontendLocaleKeys(string $locale): array
{
    $src = file_get_contents(base_path("resources/js/Utils/locales/{$locale}.js"));
    preg_match_all('/^\s{8}([a-z0-9_]+):\s/mi', $src, $m);

    return array_values(array_unique($m[1]));
}

test('frontend ar and en locale dictionaries contain the same keys', function () {
    $ar = loadFrontendLocaleKeys('ar');
    $en = loadFrontendLocaleKeys('en');

    expect($ar)->not->toBeEmpty()
        ->and($en)->not->toBeEmpty();

    $missingInEn = array_diff($ar, $en);
    $missingInAr = array_diff($en, $ar);

    expect($missingInEn)->toBeEmpty('Keys missing from en.js: '.implode(', ', $missingInEn));
    expect($missingInAr)->toBeEmpty('Keys missing from ar.js: '.implode(', ', $missingInAr));
});

test('every trans() key used in JSX exists in the frontend dictionaries', function () {
    $known = array_flip(array_merge(loadFrontendLocaleKeys('ar'), loadFrontendLocaleKeys('en')));

    $missing = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(base_path('resources/js'), FilesystemIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if (! preg_match('/\.(jsx|js)$/', $file->getFilename())) {
            continue;
        }
        if (str_contains($file->getPathname(), 'locales')) {
            continue;
        }

        $src = file_get_contents($file->getPathname());
        preg_match_all('/\btrans\(\s*[\'"]([a-z0-9_.]+)[\'"]/i', $src, $m);

        foreach ($m[1] as $key) {
            // useTrans falls back to the last dot segment
            $clean = str_contains($key, '.') ? substr($key, strrpos($key, '.') + 1) : $key;
            if (! isset($known[$key]) && ! isset($known[$clean])) {
                $missing[$key] = basename($file->getPathname());
            }
        }
    }

    expect($missing)->toBeEmpty(
        'trans() keys with no dictionary entry: '.
        implode(', ', array_map(fn ($k, $f) => "$k ($f)", array_keys($missing), $missing))
    );
});

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
