<?php

namespace App\Domain\Common\Services;

use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\SettingsService;
use App\Services\SeoService;

class SeoMetaService
{
    public function forListing(Unit|Project $listing, string $section): array
    {
        return $this->build(
            title: ($listing->name ? $listing->name.' - ' : '').config('app.name'),
            description: $this->description($listing->meta_description ?? $listing->description),
            section: $section,
            model: $listing,
            schema: $this->listingSchema($listing),
        );
    }

    public function forArticle(Article $article): array
    {
        return $this->build(
            title: ($article->title ? $article->title.' - ' : '').config('app.name'),
            description: $this->description($article->meta_description ?? $article->content),
            section: 'articles',
            model: $article,
            schema: $this->articleSchema($article),
        );
    }

    public function forPage(string $pageKey, array $customMeta = []): array
    {
        $seoService = app(SeoService::class);

        return $seoService->forPage($pageKey, $customMeta);
    }

    private function build(string $title, string $description, string $section, Unit|Project|Article $model, array $schema): array
    {
        $locale = app()->getLocale();
        $slugField = "slug_{$locale}";
        $arSlug = $model->slug_ar ?? $model->slug;
        $enSlug = $model->slug_en ?? $model->slug;
        $relativeImage = $this->resolveImage($model->images);
        $ogType = $model instanceof Article || $model instanceof Unit ? 'article' : 'website';

        $keywords = $locale === 'ar'
            ? ($model->keywords_ar ?? $model->keywords ?? [])
            : ($model->keywords_en ?? $model->keywords ?? $model->keywords_ar ?? []);

        if (is_string($keywords)) {
            $decoded = json_decode($keywords, true);
            $keywords = is_array($decoded) ? $decoded : array_map('trim', explode(',', $keywords));
        }

        if (is_array($keywords)) {
            $keywords = array_values(array_filter($keywords));
        }

        $geo = $this->resolveGeo($model);

        return [
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'image' => $relativeImage,
            'canonical' => url("/{$locale}/{$section}/".($model->$slugField ?? $model->slug)),
            'hreflang' => [
                'ar' => url("/ar/{$section}/{$arSlug}"),
                'en' => url("/en/{$section}/{$enSlug}"),
                'x-default' => url("/ar/{$section}/{$arSlug}"),
            ],
            'og_type' => $ogType,
            'schema' => $schema,
            'geo_region' => $geo['region'] ?? null,
            'geo_placename' => $geo['placename'] ?? null,
            'geo_position' => $geo['position'] ?? null,
            'icbm' => $geo['icbm'] ?? null,
        ];
    }

    private function listingSchema(Unit|Project $listing): array
    {
        $locale = app()->getLocale();
        $slugField = "slug_{$locale}";
        $section = $listing instanceof Unit ? 'units' : 'projects';
        $url = url("/{$locale}/{$section}/".($listing->$slugField ?? $listing->slug));
        $isUnit = $listing instanceof Unit;

        $hasCoords = ! empty($listing->latitude) && ! empty($listing->longitude) && (float) $listing->latitude != 0.0 && (float) $listing->longitude != 0.0;
        $locationAddress = $listing->location_address ?? null;
        $areaName = $listing->area ? ($locale === 'ar' ? ($listing->area->name_ar ?? $listing->area->name) : ($listing->area->name_en ?? $listing->area->name)) : null;

        $images = [];
        if ($listing->images) {
            foreach ($listing->images as $img) {
                $images[] = asset('storage/'.ltrim($img->path, '/'));
            }
        }
        if (empty($images)) {
            $singleImg = $this->resolveImage($listing->images, assetUrl: true);
            if ($singleImg) {
                $images[] = $singleImg;
            }
        }

        // 1. Content Location (Place)
        $placeSchema = null;
        if ($hasCoords || ! empty($locationAddress) || ! empty($areaName)) {
            $locality = $areaName ?: ($locationAddress ?: 'القاهرة الجديدة');
            $placeSchema = array_filter([
                '@type' => 'Place',
                'name' => $locality,
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => $locationAddress ?: $locality,
                    'addressLocality' => $locality,
                    'addressRegion' => $this->resolveAddressRegion($locality),
                    'addressCountry' => 'EG',
                ],
                'geo' => $hasCoords ? [
                    '@type' => 'GeoCoordinates',
                    'latitude' => (float) $listing->latitude,
                    'longitude' => (float) $listing->longitude,
                ] : null,
                'hasMap' => $hasCoords ? "https://www.google.com/maps/search/?api=1&query={$listing->latitude},{$listing->longitude}" : null,
            ], fn ($v) => $v !== null);
        }

        // 2. RealEstateListing Entity with itemOffered
        $listingEntity = array_filter([
            '@type' => 'RealEstateListing',
            '@id' => $url.'#listing',
            'name' => $listing->name,
            'description' => $this->description($listing->meta_description ?? $listing->description),
            'url' => $url,
            'image' => ! empty($images) ? $images : null,
            'datePosted' => $listing->created_at?->toIso8601String(),
            'dateModified' => $listing->updated_at?->toIso8601String(),
            'contentLocation' => $placeSchema,
        ], fn ($v) => $v !== null && $v !== '');

        if ($isUnit) {
            if ($listing->price !== null) {
                $listingEntity['offers'] = [
                    '@type' => 'Offer',
                    'price' => (float) $listing->price,
                    'priceCurrency' => config('app.currency', 'EGP'),
                    'availability' => 'https://schema.org/InStock',
                    'businessFunction' => $listing->transaction === 'rent' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
                    'url' => $url,
                ];
            }

            // Determine itemOffered type (Apartment, SingleFamilyResidence, House, etc.)
            $typeName = strtolower($listing->type?->name_en ?? $listing->type?->name ?? '');
            $itemType = 'Apartment';
            if (str_contains($typeName, 'villa') || str_contains($typeName, 'townhouse') || str_contains($typeName, 'twin')) {
                $itemType = 'SingleFamilyResidence';
            } elseif (str_contains($typeName, 'commercial') || str_contains($typeName, 'shop') || str_contains($typeName, 'retail')) {
                $itemType = 'Store';
            } elseif (str_contains($typeName, 'office') || str_contains($typeName, 'clinic')) {
                $itemType = 'Office';
            }

            $itemOffered = [
                '@type' => $itemType,
                'name' => $listing->name,
            ];
            if (! empty($listing->area_sqm)) {
                $itemOffered['floorSize'] = [
                    '@type' => 'QuantitativeValue',
                    'value' => (float) $listing->area_sqm,
                    'unitCode' => 'MTK',
                ];
            }
            if ($listing->rooms !== null) {
                $itemOffered['numberOfRooms'] = (int) $listing->rooms;
                $itemOffered['numberOfBedrooms'] = (int) $listing->rooms;
            }
            if ($listing->bathrooms !== null) {
                $itemOffered['numberOfBathroomsTotal'] = (int) $listing->bathrooms;
            }
            if ($listing->floor !== null) {
                $itemOffered['floorLevel'] = (string) $listing->floor;
            }
            if ($placeSchema) {
                $itemOffered['address'] = $placeSchema['address'] ?? null;
                $itemOffered['geo'] = $placeSchema['geo'] ?? null;
            }
            $listingEntity['itemOffered'] = array_filter($itemOffered, fn ($v) => $v !== null);
        } else {
            // Project
            $unitsCount = $listing->units_count ?? ($listing->relationLoaded('units') ? $listing->units->count() : 0);
            $listingEntity['itemOffered'] = array_filter([
                '@type' => 'ApartmentComplex',
                'name' => $listing->name,
                'numberOfAccommodationUnits' => $unitsCount > 0 ? $unitsCount : null,
                'address' => $placeSchema['address'] ?? null,
                'geo' => $placeSchema['geo'] ?? null,
            ], fn ($v) => $v !== null);
        }

        // 3. BreadcrumbList Entity
        $breadcrumbItems = [
            ['@type' => 'ListItem', 'position' => 1, 'name' => config('app.name'), 'item' => url("/{$locale}")],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $isUnit ? ($locale === 'ar' ? 'الوحدات والعقارات' : 'Units') : ($locale === 'ar' ? 'المشاريع' : 'Projects'), 'item' => url("/{$locale}/{$section}")],
        ];
        $pos = 3;
        if ($listing->area) {
            $breadcrumbItems[] = [
                '@type' => 'ListItem',
                'position' => $pos++,
                'name' => $areaName,
                'item' => url("/{$locale}/areas/".($listing->area->slug ?? $listing->area->id)),
            ];
        }
        $breadcrumbItems[] = [
            '@type' => 'ListItem',
            'position' => $pos,
            'name' => $listing->name,
            'item' => $url,
        ];
        $breadcrumbSchema = [
            '@type' => 'BreadcrumbList',
            '@id' => $url.'#breadcrumb',
            'itemListElement' => $breadcrumbItems,
        ];

        // 4. FAQPage Entity (AEO Optimization for AI Search Engines)
        $faqSchema = $this->buildFaqSchema($listing, $locale);

        // 5. Organization Entity (RealEstateAgent)
        $agentSchema = app(SeoService::class)->getRealEstateAgentSchema();

        return [
            '@context' => 'https://schema.org',
            '@graph' => array_values(array_filter([
                $listingEntity,
                $breadcrumbSchema,
                $faqSchema,
                $agentSchema,
            ])),
        ];
    }

    private function buildFaqSchema(Unit|Project $listing, string $locale): array
    {
        $isAr = $locale === 'ar';
        $section = $listing instanceof Unit ? 'units' : 'projects';
        $slugField = "slug_{$locale}";
        $areaName = $listing->area ? ($isAr ? ($listing->area->name_ar ?? $listing->area->name) : ($listing->area->name_en ?? $listing->area->name)) : ($isAr ? 'مصر' : 'Egypt');
        $address = $listing->location_address ?: $areaName;

        $faqs = [];

        if ($listing instanceof Unit) {
            $formattedPrice = $listing->price ? number_format((float) $listing->price).' '.config('app.currency', 'EGP') : ($isAr ? 'عند الطلب' : 'Upon Request');
            $paymentMethod = $listing->payment_method === 'cash' ? ($isAr ? 'كاش فقط' : 'Cash only') : ($listing->payment_method === 'installment' ? ($isAr ? 'تقسيط' : 'Installments') : ($isAr ? 'كاش أو تقسيط' : 'Cash or Installments'));

            // Q1: Price and Payment
            $q1 = $isAr ? "ما هو سعر وطرق سداد {$listing->name}؟" : "What is the price and payment plan for {$listing->name}?";
            $a1 = $isAr
                ? "سعر {$listing->name} هو {$formattedPrice} بنظام سداد ({$paymentMethod})، مع تسهيلات مرنة مقدمة من فاميلي هوم للتطوير العقاري."
                : "The price for {$listing->name} is {$formattedPrice} with ({$paymentMethod}) payment options and flexible plans from Family Home.";
            $faqs[] = ['question' => $q1, 'answer' => $a1];

            // Q2: Location
            $q2 = $isAr ? "أين تقع {$listing->name} بالتحديد؟" : "Where is {$listing->name} located exactly?";
            $a2 = $isAr
                ? "تقع في {$areaName} ({$address})، وتتميز بموقع استراتيجي قريب من أهم المحاور والطرق الرئيسية والخدمات الحيوية."
                : "Located in {$areaName} ({$address}), offering prime access to major roads and essential community services.";
            $faqs[] = ['question' => $q2, 'answer' => $a2];

            // Q3: Specs
            $specs = [];
            if ($listing->area_sqm) $specs[] = $isAr ? "مساحة {$listing->area_sqm} م²" : "{$listing->area_sqm} sqm area";
            if ($listing->rooms) $specs[] = $isAr ? "{$listing->rooms} غرف نوم" : "{$listing->rooms} bedrooms";
            if ($listing->bathrooms) $specs[] = $isAr ? "{$listing->bathrooms} حمامات" : "{$listing->bathrooms} bathrooms";
            if ($listing->floor !== null) $specs[] = $isAr ? "الدور {$listing->floor}" : "Floor {$listing->floor}";
            $specsText = implode('، ', $specs);

            $q3 = $isAr ? "ما هي مواصفات ومساحة {$listing->name}؟" : "What are the specs and area of {$listing->name}?";
            $a3 = $isAr
                ? "تتضمن {$listing->name}: {$specsText}، مع تصميم عصري وتقسيم داخلي مثالي."
                : "{$listing->name} features: {$specsText}, with modern architecture and optimal living spaces.";
            $faqs[] = ['question' => $q3, 'answer' => $a3];

            // Q4: Booking / Viewing
            $q4 = $isAr ? "كيف يمكن معاينة وحجز {$listing->name}؟" : "How can I schedule a viewing or book {$listing->name}?";
            $a4 = $isAr
                ? "يمكنك حجز موعد معاينة مجاني ومباشر بالتواصل مع فريق فاميلي هوم عبر الواتساب أو الهاتف لتوفير كافة التفاصيل والمستندات."
                : "You can book a free viewing by contacting the Family Home sales team directly via WhatsApp or phone.";
            $faqs[] = ['question' => $q4, 'answer' => $a4];
        } else {
            // Project
            $unitsCount = $listing->units_count ?? ($listing->relationLoaded('units') ? $listing->units->count() : 0);
            $downPayment = $listing->down_payment ? "{$listing->down_payment}%" : ($isAr ? 'مقدم يبدأ من أقل نسبة' : 'minimum down payment');
            $installYears = $listing->installment_years ? ($isAr ? "تقسيط يصل إلى {$listing->installment_years} سنوات" : "up to {$listing->installment_years} years installment") : ($isAr ? 'تسهيلات سداد مريحة' : 'flexible installments');

            // Q1: Location
            $q1 = $isAr ? "أين يقع مشروع {$listing->name}؟" : "Where is {$listing->name} project located?";
            $a1 = $isAr
                ? "يقع مشروع {$listing->name} في منطقة {$areaName} ({$address}) بالقرب من الخدمات الرئيسية والمحاور الحيوية."
                : "The {$listing->name} project is located in {$areaName} ({$address}) close to prime hubs and services.";
            $faqs[] = ['question' => $q1, 'answer' => $a1];

            // Q2: Payment and Installment
            $q2 = $isAr ? "ما هي أنظمة السداد والتقسيط في مشروع {$listing->name}؟" : "What are the payment and installment options in {$listing->name}?";
            $a2 = $isAr
                ? "يوفر المشروع خطط دفع ميسرة تشمل مقدم {$downPayment} مع {$installYears}."
                : "The project offers flexible payment plans including {$downPayment} and {$installYears}.";
            $faqs[] = ['question' => $q2, 'answer' => $a2];

            // Q3: Units and Features
            $q3 = $isAr ? "ما هي الوحدات والمرافق المتاحة في مشروع {$listing->name}؟" : "What units and amenities are available in {$listing->name}?";
            $a3 = $isAr
                ? "يضم المشروع {$unitsCount} وحدة متنوعة بتصميمات عصرية ومرافق متكاملة تشمل الأمن ومواقف السيارات والمساحات الخضراء."
                : "The project features {$unitsCount} diverse units with modern designs and full amenities including security and parking.";
            $faqs[] = ['question' => $q3, 'answer' => $a3];

            // Q4: Booking
            $q4 = $isAr ? "كيف يمكن حجز وحدة في مشروع {$listing->name}؟" : "How can I book a unit in {$listing->name}?";
            $a4 = $isAr
                ? "تواصل مباشرة مع مستشاري فاميلي هوم العقاريين عبر الهاتف أو الواتساب للاستفسار عن الوحدات المتاحة والأسعار الحالية وحجز موعد."
                : "Contact Family Home real estate consultants directly via phone or WhatsApp for available units, current prices, and bookings.";
            $faqs[] = ['question' => $q4, 'answer' => $a4];
        }

        $mainEntity = [];
        foreach ($faqs as $faq) {
            $mainEntity[] = [
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $faq['answer'],
                ],
            ];
        }

        return [
            '@type' => 'FAQPage',
            '@id' => url("/{$locale}/{$section}/".($listing->$slugField ?? $listing->slug)).'#faq',
            'mainEntity' => $mainEntity,
        ];
    }

    private function resolveGeo(Unit|Project|Article $model): array
    {
        if ($model instanceof Article) {
            return [
                'region' => 'EG-C',
                'placename' => app()->getLocale() === 'ar' ? 'القاهرة الجديدة، مصر' : 'New Cairo, Egypt',
                'position' => null,
                'icbm' => null,
            ];
        }

        $lat = $model->latitude;
        $lng = $model->longitude;
        $hasCoords = ! empty($lat) && ! empty($lng) && (float) $lat != 0.0 && (float) $lng != 0.0;

        $areaName = $model->area ? ($model->area->name_ar ?? $model->area->name) : '';
        $address = $model->location_address ?: $areaName;

        $region = $this->resolveGeoRegion($areaName.' '.$address);
        $locale = app()->getLocale();
        $countryName = $locale === 'ar' ? 'مصر' : 'Egypt';
        $placename = $address ? "{$address}، {$countryName}" : ($areaName ? "{$areaName}، {$countryName}" : ($locale === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt'));

        return [
            'region' => $region,
            'placename' => $placename,
            'position' => $hasCoords ? "{$lat};{$lng}" : null,
            'icbm' => $hasCoords ? "{$lat}, {$lng}" : null,
        ];
    }

    private function resolveGeoRegion(string $text): string
    {
        $textLower = mb_strtolower($text);

        // Giza Governorate (Zayed, October, Haram, etc.)
        if (str_contains($textLower, 'زايد') || str_contains($textLower, 'zayed') ||
            str_contains($textLower, 'أكتوبر') || str_contains($textLower, 'october') ||
            str_contains($textLower, 'الجيزة') || str_contains($textLower, 'giza') ||
            str_contains($textLower, 'الهرم') || str_contains($textLower, 'الدقي')) {
            return 'EG-GZ';
        }

        // Alexandria
        if (str_contains($textLower, 'إسكندرية') || str_contains($textLower, 'اسكندرية') || str_contains($textLower, 'alexandria')) {
            return 'EG-ALX';
        }

        // Red Sea / Coastal
        if (str_contains($textLower, 'الغردقة') || str_contains($textLower, 'hurghada') || str_contains($textLower, 'الجونة')) {
            return 'EG-BA';
        }

        // Default to Cairo Governorate (EG-C) for New Cairo, Tagamoa, Shorouk, Rehab, New Capital, etc.
        return 'EG-C';
    }

    private function resolveAddressRegion(string $text): string
    {
        $regionCode = $this->resolveGeoRegion($text);
        if ($regionCode === 'EG-GZ') {
            return app()->getLocale() === 'ar' ? 'الجيزة' : 'Giza';
        }
        if ($regionCode === 'EG-ALX') {
            return app()->getLocale() === 'ar' ? 'الإسكندرية' : 'Alexandria';
        }
        return app()->getLocale() === 'ar' ? 'القاهرة' : 'Cairo';
    }

    private function articleSchema(Article $article): array
    {
        $settingsService = app(SettingsService::class);
        $logoPath = $settingsService->get('site_logo');
        $logoUrl = $logoPath ? asset('storage/'.$logoPath) : asset('icon.png');

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $article->title,
            'description' => $this->description($article->meta_description ?? $article->content),
            'image' => $this->resolveImage($article->images, assetUrl: true) ?: null,
            'datePublished' => $article->created_at?->toIso8601String(),
            'dateModified' => $article->updated_at?->toIso8601String(),
            'author' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'url' => url('/'),
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => config('app.name'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => $logoUrl,
                ],
                'url' => url('/'),
            ],
        ], fn ($v) => $v !== null && $v !== '');
    }

    /**
     * Resolve the primary image path for a model's image collection.
     *
     * Falls back to the first image if no primary is set.
     *
     * @param  bool  $assetUrl  When true, returns a full public asset URL (for JSON-LD schema).
     *                          When false, returns the raw storage-relative path (for OG/meta tags).
     */
    private function resolveImage($images, bool $assetUrl = false): ?string
    {
        $image = $images?->firstWhere('is_primary', true) ?? $images?->first();

        if (! $image) {
            return null;
        }

        return $assetUrl ? asset('storage/'.$image->path) : $image->path;
    }

    private function description(?string $text): string
    {
        $clean = $text ?? '';

        // 1. Strip HTML tags
        $clean = strip_tags($clean);

        // 2. Strip markdown syntax characters so unit descriptions stored as
        //    markdown don't leak symbols like **bold**, ### heading, * list, - dash
        //    into the meta description / OG description.
        $clean = preg_replace('/\*{1,3}([^*]*)\*{1,3}/', '$1', $clean);   // **bold** / *italic* / ***bold-italic***
        $clean = preg_replace('/#{1,6}\s*/', '', $clean);                  // ### headings
        $clean = preg_replace('/^[\s\-\*\+]\s+/m', '', $clean);           // - list item / * list item / + list item
        $clean = preg_replace('/\[([^\]]+)\]\([^\)]+\)/', '$1', $clean);  // [link text](url)
        $clean = preg_replace('/`{1,3}[^`]*`{1,3}/', '', $clean);         // `code` / ```code```
        $clean = preg_replace('/_{1,2}([^_]*)_{1,2}/', '$1', $clean);     // __bold__ / _italic_

        // 3. Collapse whitespace and trim, then limit to 160 chars for SEO
        return (string) str($clean)->squish()->limit(160);
    }
}
