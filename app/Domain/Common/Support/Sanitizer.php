<?php

namespace App\Domain\Common\Support;

class Sanitizer
{
    public static function text(string $value): string
    {
        return trim(htmlspecialchars(strip_tags($value), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
    }

    public static function rich(string $value): string
    {
        $previous = libxml_use_internal_errors(true);
        $document = new \DOMDocument('1.0', 'UTF-8');
        $document->loadHTML(
            '<?xml encoding="utf-8" ?><div id="sanitizer-root">'.$value.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        $root = $document->getElementById('sanitizer-root');
        if (! $root) {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);

            return '';
        }

        self::sanitizeRichNode($root);

        $html = '';
        foreach ($root->childNodes as $child) {
            $html .= $document->saveHTML($child);
        }

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return trim($html);
    }

    private static function sanitizeRichNode(\DOMNode $node): void
    {
        $allowedTags = [
            'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'sub', 'sup', 'ol', 'li', 'ul',
            'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'span', 'div', 'hr',
            'figure', 'img', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        ];

        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof \DOMElement) {
                if (! in_array(strtolower($child->tagName), $allowedTags, true)) {
                    while ($child->firstChild) {
                        $node->insertBefore($child->firstChild, $child);
                    }
                    $node->removeChild($child);
                    self::sanitizeRichNode($node);

                    return;
                }

                self::sanitizeRichAttributes($child);
            }

            self::sanitizeRichNode($child);
        }
    }

    private static function sanitizeRichAttributes(\DOMElement $element): void
    {
        $tag = strtolower($element->tagName);
        $allowed = match ($tag) {
            'a' => ['href', 'title', 'class', 'target', 'rel'],
            'img' => ['src', 'alt', 'title', 'width', 'height', 'class'],
            'span' => ['class', 'style'],
            default => ['class'],
        };

        foreach (iterator_to_array($element->attributes) as $attribute) {
            $name = strtolower($attribute->name);
            if (! in_array($name, $allowed, true)) {
                $element->removeAttribute($attribute->name);

                continue;
            }

            if ($name === 'style') {
                $safeStyle = self::sanitizeStyleAttribute($attribute->value);
                if ($safeStyle === '') {
                    $element->removeAttribute($attribute->name);
                } else {
                    $element->setAttribute('style', $safeStyle);
                }
            }
        }

        if ($tag === 'a') {
            if ($element->hasAttribute('href') && ! self::isSafeLink($element->getAttribute('href'))) {
                $element->removeAttribute('href');
            }

            if ($element->getAttribute('target') === '_blank') {
                $element->setAttribute('rel', 'noopener noreferrer');
            }
        }

        if ($tag === 'img' && $element->hasAttribute('src') && ! self::isSafeImageSource($element->getAttribute('src'))) {
            $element->removeAttribute('src');
        }
    }

    private static function sanitizeStyleAttribute(string $style): string
    {
        $safeParts = [];

        foreach (explode(';', $style) as $declaration) {
            $declaration = trim($declaration);
            if ($declaration === '' || ! str_contains($declaration, ':')) {
                continue;
            }

            [$property, $value] = array_map('trim', explode(':', $declaration, 2));
            $property = strtolower($property);

            if ($property === 'color' && self::isSafeColorValue($value)) {
                $safeParts[] = "color: {$value}";
            }

            if ($property === 'font-size' && self::isSafeFontSizeValue($value)) {
                $safeParts[] = "font-size: {$value}";
            }
        }

        return implode('; ', $safeParts);
    }

    private static function isSafeColorValue(string $value): bool
    {
        $value = strtolower(trim($value));

        if ($value === '' || str_contains($value, 'expression') || str_contains($value, 'javascript')) {
            return false;
        }

        return (bool) preg_match('/^(#[0-9a-f]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)|[a-z]{3,20})$/', $value);
    }

    private static function isSafeFontSizeValue(string $value): bool
    {
        $value = strtolower(trim($value));

        if ($value === '' || str_contains($value, 'expression') || str_contains($value, 'javascript')) {
            return false;
        }

        if (! preg_match('/^(\d{1,3}(\.\d{1,2})?)(px|em|rem|pt|%)$/', $value, $matches)) {
            return false;
        }

        $numeric = (float) $matches[1];
        $unit = $matches[3];

        return match ($unit) {
            'px' => $numeric >= 8 && $numeric <= 72,
            'em', 'rem' => $numeric >= 0.5 && $numeric <= 4,
            'pt' => $numeric >= 6 && $numeric <= 54,
            '%' => $numeric >= 50 && $numeric <= 200,
            default => false,
        };
    }

    private static function isSafeLink(string $url): bool
    {
        return str_starts_with($url, '/')
            || str_starts_with($url, '#')
            || (bool) preg_match('#^(https?:|mailto:|tel:)#i', trim($url));
    }

    private static function isSafeImageSource(string $url): bool
    {
        $url = trim($url);

        return str_starts_with($url, '/storage/')
            || str_starts_with($url, 'storage/')
            || str_starts_with($url, '/')
            || (bool) preg_match('#^https?://#i', $url);
    }

    public static function isValidMapEmbed(string $value): bool
    {
        $src = self::extractMapSrc($value);

        if (! $src) {
            return false;
        }

        $host = parse_url($src, PHP_URL_HOST);

        return $host !== null
            && (str_ends_with($host, 'google.com')
                || str_ends_with($host, 'maps.google.com')
                || str_ends_with($host, 'google.com.sa')
                || str_ends_with($host, 'maps.google.com.sa'));
    }

    public static function extractMapSrc(string $value): ?string
    {
        // إذا كانت iframe → استخرج الـ src
        if (preg_match('/<iframe\s+[^>]*src\s*=\s*"([^"]+)"[^>]*>/i', $value, $m)) {
            return $m[1];
        }

        if (preg_match("/<iframe\s+[^>]*src\s*=\s*'([^']+)'[^>]*>/i", $value, $m)) {
            return $m[1];
        }

        // إذا كان رابط مباشر
        if (preg_match('#^https?://[^\s"\']+$#', $value)) {
            return $value;
        }

        return null;
    }
}
