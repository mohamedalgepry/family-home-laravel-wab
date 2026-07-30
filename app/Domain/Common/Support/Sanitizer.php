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
        $allowed = '<p><br><b><strong><i><em><u><s><sub><sup><ol><li><ul>'
            .'<h2><h3><h4><h5><h6><blockquote><pre><code><span><div>'
            .'<hr><figure><img><a><table><thead><tbody><tr><th><td>';

        $stripped = strip_tags($value, $allowed);

        $stripped = preg_replace('/\s+on\w+\s*=\s*"[^"]*"/i', '', $stripped);
        $stripped = preg_replace('/\s+on\w+\s*=\s*\'[^\']*\'/i', '', $stripped);
        $stripped = preg_replace('/\s+on\w+\s*=\s*[^\s>"]+(?=\s|>)/i', '', $stripped);
        $stripped = preg_replace('/<a\s+[^>]*href\s*=\s*"(?:javascript|vbscript|data):[^"]*"[^>]*>/i', '<a href="#">', $stripped);
        $stripped = preg_replace("/<a\s+[^>]*href\s*=\s*'(?:javascript|vbscript|data):[^']*'[^>]*>/i", "<a href='#'>", $stripped);

        return trim($stripped);
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
