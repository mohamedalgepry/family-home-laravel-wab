<?php

namespace App\Http\Requests\Traits;

trait ExtractsCoordinatesFromUrl
{
    protected function extractCoordinates(string $url): ?array
    {
        // Resolve short Google Maps URLs (e.g., maps.app.goo.gl or g.page)
        if (str_contains($url, 'goo.gl') || str_contains($url, 'g.page')) {
            $url = $this->resolveShortUrl($url) ?? $url;
        }

        // Pattern 1: !3dlat!4dlng (exact pin from expanded maps URL)
        if (preg_match('/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[1], 'longitude' => $matches[2]];
        }

        // Pattern 2: /@lat,lng (viewport center)
        if (preg_match('/@(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[1], 'longitude' => $matches[2]];
        }
        
        // Pattern 3: embed ?pb=... !2dlng!3dlat
        if (preg_match('/!2d(-?\d+\.\d+).*?!3d(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[2], 'longitude' => $matches[1]];
        }
        
        // Pattern 4: ?q=lat,lng or ?query=lat,lng
        if (preg_match('/[?&](q|query)=(-?\d+\.\d+),(-?\d+\.\d+)/', $url, $matches)) {
            return ['latitude' => $matches[2], 'longitude' => $matches[3]];
        }
        
        return null;
    }

    protected function resolveShortUrl(string $url): ?string
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        curl_exec($ch);
        $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);
        
        return $finalUrl;
    }

    protected function prepareCoordinatesFromMapUrl(): void
    {
        $mapUrl = $this->input('map_url') ?: $this->input('map_embed_url');
        
        if ($mapUrl) {
            $coords = $this->extractCoordinates($mapUrl);
            if ($coords) {
                $this->merge([
                    'latitude' => $coords['latitude'],
                    'longitude' => $coords['longitude'],
                ]);
            }
        }
    }
}
