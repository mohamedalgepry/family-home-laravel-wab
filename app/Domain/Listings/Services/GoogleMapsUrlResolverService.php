<?php

namespace App\Domain\Listings\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Psr\Http\Message\ResponseInterface;

class GoogleMapsUrlResolverService
{
    /**
     * Resolve the Google Maps URL and extract latitude and longitude.
     * Returns an array with 'latitude' and 'longitude', or null if invalid.
     */
    public function resolveAndExtract(string $url): ?array
    {
        // P0-2: Only allow HTTPS scheme
        $scheme = strtolower(parse_url($url, PHP_URL_SCHEME) ?? '');
        if ($scheme !== 'https') {
            return null;
        }

        $host = parse_url($url, PHP_URL_HOST);
        if (! $host || ! $this->isAllowedGoogleHost($host)) {
            return null;
        }

        $finalUrl = $url;
        $html = '';
        if (str_contains($url, 'goo.gl') || str_contains($url, 'g.page')) {
            $resolved = $this->resolveUrl($url);
            if (! $resolved) {
                return null;
            }
            $finalUrl = $resolved['url'];
            $html = $resolved['html'];
        }

        if (! $finalUrl) {
            return null;
        }

        $coords = $this->extractCoordinatesFromUrl($finalUrl);

        if (! $coords && $html) {
            $coords = $this->extractCoordinatesFromHtml($html);
        }

        if (! $coords || ! $this->validateCoordinates($coords['latitude'], $coords['longitude'])) {
            return null;
        }

        return $coords;
    }

    /**
     * Follow redirects for short URLs and return the final resolved Google Maps URL and HTML body.
     * Global deadline: 10 seconds total (FR-2.5). Per-hop connect timeout: 5 seconds.
     */
    protected function resolveUrl(string $url): ?array
    {
        $host = parse_url($url, PHP_URL_HOST);
        if (! $host || ! $this->isAllowedGoogleHost($host)) {
            return null;
        }

        $current = $url;
        // P0-3: Track global deadline — 10 seconds total
        $deadline = microtime(true) + 10.0;

        for ($i = 0; $i < 5; $i++) {
            if (microtime(true) >= $deadline) {
                return null;
            }

            $targetHost = parse_url($current, PHP_URL_HOST);

            if (! $targetHost || ! $this->isAllowedGoogleHost($targetHost)) {
                return null;
            }

            // P1-5: SSRF DNS Rebinding Protection. hostIsPublic now returns the resolved IP
            $targetIp = $this->hostIsPublic($targetHost);
            if (! $targetIp) {
                return null;
            }

            // P0-3: Check deadline again after DNS resolution
            if (microtime(true) >= $deadline) {
                return null;
            }

            // P0-2: Ensure each hop URL is also HTTPS
            $hopScheme = strtolower(parse_url($current, PHP_URL_SCHEME) ?? '');
            if ($hopScheme !== 'https') {
                return null;
            }

            // P0-3: Exact float remaining seconds. Abort if <= 0
            $remainingSeconds = $deadline - microtime(true);
            if ($remainingSeconds <= 0) {
                return null;
            }

            try {
                $response = Http::withOptions([
                    'allow_redirects' => false,
                    'timeout' => $remainingSeconds, // exact float timeout
                    'connect_timeout' => min(5.0, $remainingSeconds),
                    'verify' => app()->environment('production'),
                    // P0-6: Use stream mode so body is not downloaded by default
                    'stream' => true,
                    // P1-5: Pin the target host to the verified IP to prevent DNS rebinding
                    'curl' => [
                        CURLOPT_RESOLVE => ["{$targetHost}:443:{$targetIp}"],
                    ],
                    // P0-6: Early abort if Content-Length is maliciously large
                    'on_headers' => function (ResponseInterface $response) {
                        if ($response->hasHeader('Content-Length')) {
                            $length = (int) $response->getHeaderLine('Content-Length');
                            if ($length > 1024 * 1024) { // 1MB limit
                                throw new \Exception('Response size exceeds 1MB limit');
                            }
                        }
                    },
                ])->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (compatible; FamilyHome/1.0)',
                ])->get($current);

                // FR-2.6: Read body in chunks to enforce 1MB limit for chunked responses
                $body = $response->getBody();
                $downloadedBytes = 0;
                $html = '';
                while (! $body->eof()) {
                    if (microtime(true) >= $deadline) {
                        throw new \Exception('Global timeout exceeded during body stream');
                    }
                    $chunk = $body->read(8192); // 8KB chunks
                    $downloadedBytes += strlen($chunk);
                    if ($downloadedBytes > 1024 * 1024) {
                        throw new \Exception('Response size exceeds 1MB limit (chunked)');
                    }
                    $html .= $chunk;
                }
                $body->close();

            } catch (\Throwable $e) {
                Log::error('GoogleMapsUrlResolverService error: '.$e->getMessage());

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

                // P0-5: Validate redirect Location scheme is HTTPS
                $redirectScheme = strtolower(parse_url($next, PHP_URL_SCHEME) ?? '');
                if ($redirectScheme !== 'https') {
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
                return ['url' => $current, 'html' => $html];
            }

            return null;
        }

        return ['url' => $current, 'html' => ''];
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

    protected function extractCoordinatesFromHtml(string $html): ?array
    {
        // Extract the og:image meta tag content which often contains a static map URL with coordinates
        if (preg_match('/meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m) ||
            preg_match('/meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']/i', $html, $m)) {

            $imageUrl = html_entity_decode($m[1]);

            // Look for center=LAT,LNG or center=LAT%2CLNG
            if (preg_match('/center=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i', $imageUrl, $coords)) {
                return ['latitude' => $coords[1], 'longitude' => $coords[2]];
            }
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

        // P1-8: Reject NaN, Infinity, and Null Island (0,0)
        if (! is_finite($lat) || ! is_finite($lng)) {
            return false;
        }

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
     * Fail-closed: if DNS resolution yields no IPs, the host is considered unsafe.
     * Explicitly blocks 169.254.0.0/16 (link-local / cloud metadata service).
     *
     * @return string|null Returns the safe IP address to connect to, or null if invalid.
     */
    private function hostIsPublic(string $host): ?string
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
            if (is_array($fallback) && count($fallback) > 0) {
                $ips = $fallback;
            }
        }

        // P0-7: Fail-closed — if we cannot resolve any IP, block the request
        if (empty($ips)) {
            return null;
        }

        foreach ($ips as $ip) {
            // Block private/reserved ranges (covers 127.x, 10.x, 172.16-31.x, 192.168.x)
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
                return null;
            }

            // Explicitly block link-local / cloud metadata 169.254.0.0/16
            if (str_starts_with($ip, '169.254.')) {
                return null;
            }

            // Block null address
            if ($ip === '0.0.0.0' || $ip === '::') {
                return null;
            }
        }

        // All resolved IPs are public. Return the first IP to use for connecting (prevents DNS rebinding).
        return $ips[0];
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
