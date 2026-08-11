<?php

namespace App\Domain\Listings\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class GoogleMapsUrlResolverService
{
    /**
     * Resolve the Google Maps URL and extract latitude and longitude.
     * Returns an array with 'latitude' and 'longitude', or null if invalid.
     */
    public function resolveAndExtract(string $url): ?array
    {
        $host = parse_url($url, PHP_URL_HOST);
        if (! $host || ! $this->isAllowedGoogleHost($host)) {
            return null;
        }

        $finalUrl = $url;
        if (str_contains($url, 'goo.gl') || str_contains($url, 'g.page')) {
            $finalUrl = $this->resolveUrl($url);
        }

        if (! $finalUrl) {
            return null;
        }

        $coords = $this->extractCoordinatesFromUrl($finalUrl);
        if (! $coords || ! $this->validateCoordinates($coords['latitude'], $coords['longitude'])) {
            return null;
        }

        return $coords;
    }

    /**
     * Follow redirects for short URLs and return the final resolved Google Maps URL.
     */
    protected function resolveUrl(string $url): ?string
    {
        $host = parse_url($url, PHP_URL_HOST);
        if (! $host || ! $this->isAllowedGoogleHost($host)) {
            return null;
        }

        $current = $url;
        for ($i = 0; $i < 5; $i++) {
            $targetHost = parse_url($current, PHP_URL_HOST);

            if (! $targetHost || ! $this->isAllowedGoogleHost($targetHost)) {
                return null;
            }

            if (! $this->hostIsPublic($targetHost)) {
                return null;
            }

            try {
                $response = Http::withOptions([
                    'allow_redirects' => false,
                    'timeout' => 5,
                    'verify' => app()->environment('production'),
                ])->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; FamilyHome/1.0)',
                ])->get($current);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('GoogleMapsUrlResolverService error: ' . $e->getMessage());
                return null;
            }

            if ($response->redirect()) {
                $location = $response->header('Location');
                if (! $location) {
                    return null;
                }

                $next = $this->absoluteUrl($current, $location);
                if (! $next) {
                    return null;
                }

                $nextHost = parse_url($next, PHP_URL_HOST);
                if (! $nextHost || ! $this->isAllowedGoogleHost($nextHost)) {
                    return null;
                }

                $current = $next;
                continue;
            }

            if ($response->successful()) {
                return $current;
            }

            return null;
        }

        return $current;
    }

    protected function extractCoordinatesFromUrl(string $url): ?array
    {
        // Pattern 1: !3dlat!4dlng (exact pin from expanded maps URL)
        if (preg_match('/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[1], 'longitude' => $matches[2]];
        }

        // Pattern 2: ?q=lat,lng or ?query=lat,lng
        if (preg_match('/[?&](q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[2], 'longitude' => $matches[3]];
        }

        // Pattern 3: center=lat,lng
        if (preg_match('/[?&]center=(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[1], 'longitude' => $matches[2]];
        }

        // Pattern 4: /@lat,lng (viewport center)
        if (preg_match('/@(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[1], 'longitude' => $matches[2]];
        }
        
        // Pattern 5: embed ?pb=... !2dlng!3dlat
        if (preg_match('/!2d(-?\d+\.\d+).*?!3d(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[2], 'longitude' => $matches[1]];
        }

        return null;
    }

    protected function validateCoordinates($lat, $lng): bool
    {
        if (! is_numeric($lat) || ! is_numeric($lng)) {
            return false;
        }

        $lat = (float) $lat;
        $lng = (float) $lng;

        if ($lat == 0.0 && $lng == 0.0) {
            return false;
        }

        if ($lat < -90 || $lat > 90) {
            return false;
        }

        if ($lng < -180 || $lng > 180) {
            return false;
        }

        return true;
    }

    private function isAllowedGoogleHost(string $host): bool
    {
        $host = strtolower(trim($host));

        if (filter_var($host, FILTER_VALIDATE_IP)) {
            return false;
        }

        return $host === 'goo.gl'
            || str_ends_with($host, '.goo.gl')
            || $host === 'g.page'
            || str_ends_with($host, '.g.page')
            || $host === 'google.com'
            || str_ends_with($host, '.google.com');
    }

    /**
     * Reject hosts whose DNS resolves to a private / reserved IP to prevent SSRF.
     */
    private function hostIsPublic(string $host): bool
    {
        $records = @dns_get_record($host, DNS_A | DNS_AAAA);
        $ips = [];

        if (is_array($records)) {
            foreach ($records as $record) {
                if (($record['type'] ?? '') === 'A' && ! empty($record['ip'])) {
                    $ips[] = $record['ip'];
                } elseif (($record['type'] ?? '') === 'AAAA' && ! empty($record['ipv6'])) {
                    $ips[] = $record['ipv6'];
                }
            }
        }

        if (empty($ips)) {
            $fallback = @gethostbynamel($host);
            if (is_array($fallback)) {
                $ips = $fallback;
            }
        }

        foreach ($ips as $ip) {
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
                return false;
            }
        }

        return true;
    }

    private function absoluteUrl(string $base, string $location): ?string
    {
        if (preg_match('#^https?://#i', $location)) {
            return $location;
        }

        if (str_starts_with($location, '/')) {
            $parts = parse_url($base);
            return ($parts['scheme'] ?? 'https').'://'.($parts['host'] ?? '').$location;
        }

        return null;
    }
}
