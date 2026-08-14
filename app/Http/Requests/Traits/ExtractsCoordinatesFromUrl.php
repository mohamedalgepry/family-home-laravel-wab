<?php

namespace App\Http\Requests\Traits;

use App\Domain\Listings\Services\GoogleMapsUrlResolverService;
use Illuminate\Validation\ValidationException;

trait ExtractsCoordinatesFromUrl
{
    protected function prepareCoordinatesFromMapUrl(): void
    {
        $field = $this->has('map_embed_url') ? 'map_embed_url' : 'map_url';
        $mapUrl = $this->input($field);

        if ($mapUrl) {
            /** @var GoogleMapsUrlResolverService $resolver */
            $resolver = app(GoogleMapsUrlResolverService::class);
            $coords = $resolver->resolveAndExtract($mapUrl);

            if ($coords) {
                $this->merge([
                    'latitude' => $coords['latitude'],
                    'longitude' => $coords['longitude'],
                ]);
            } elseif (! $this->filled('latitude') || ! $this->filled('longitude')) {
                throw ValidationException::withMessages([
                    $field => __('common.invalid_map_url') ?? 'Invalid Google Maps Location URL.',
                ]);
            }
        }
    }
}
