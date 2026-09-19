@props(['agent' => null])

@php
    $locale = app()->getLocale();
    $settings = app(\App\Domain\Listings\Services\SettingsService::class);
    $siteLogo = $settings->get('site_logo');
    $logoUrl = $siteLogo ? asset('storage/'.$siteLogo) : asset('icon.png');

    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'RealEstateAgent',
        '@id' => url("/{$locale}").'#agent',
        'name' => $agent?->name ?? __('seo.company_name'),
        'url' => url("/{$locale}"),
        'logo' => $logoUrl,
        'image' => $agent?->profile?->avatar ? asset('storage/'.$agent->profile->avatar) : $logoUrl,
        'telephone' => $agent?->profile?->phone ?? $settings->get('company_phone') ?: '+201000000000',
        'email' => $agent?->email ?? $settings->get('company_email') ?: 'info@familyhome-co.com',
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => $settings->get('company_address') ?: 'القاهرة، مصر',
            'addressCountry' => 'EG',
        ],
    ];
@endphp

<script type="application/ld+json">
    {!! json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
</script>
