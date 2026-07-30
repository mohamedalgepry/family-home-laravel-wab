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
            'a' => ['href', 'title', 'class'],
            'img' => ['src', 'alt', 'title', 'width', 'height', 'class'],
            default => ['class'],
        };

        foreach (iterator_to_array($element->attributes) as $attribute) {
            $name = strtolower($attribute->name);
            if (! in_array($name, $allowed, true)) {
                $element->removeAttribute($attribute->name);
            }
        }

        if ($tag === 'a' && $element->hasAttribute('href') && ! self::isSafeLink($element->getAttribute('href'))) {
            $element->removeAttribute('href');
        }

        if ($tag === 'img' && $element->hasAttribute('src') && ! self::isSafeImageSource($element->getAttribute('src'))) {
            $element->removeAttribute('src');
        }
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
