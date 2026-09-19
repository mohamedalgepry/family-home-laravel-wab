<?php

namespace App\Domain\Assistant\DTOs;

class UnitPublicDTO
{
    public function __construct(
        public readonly int $id,
        public readonly int $projectId,
        public readonly string $name,
        public readonly string $slug,
        public readonly string $url,
        public readonly string $imageUrl,
        public readonly ?string $location,
        public readonly float $price,
        public readonly string $priceFormatted,
        public readonly string $currency,
        public readonly ?float $areaSqm,
        public readonly int $rooms,
        public readonly int $bathrooms,
        public readonly ?string $transaction,
        public readonly ?string $paymentMethod,
        public readonly ?string $descriptionSnippet,
        public readonly ?string $whatsappUrl,
        public readonly ?string $agentName,
        public readonly ?string $agentPhone,
        public readonly ?string $agentWhatsapp,
    ) {}

    public static function fromModel(object $unit, string $locale = 'ar', ?string $companyWhatsapp = null): self
    {
        $name = $locale === 'ar'
            ? ($unit->name_ar ?? $unit->name ?? '')
            : ($unit->name_en ?? $unit->name ?? '');

        $slug = $locale === 'ar'
            ? ($unit->slug_ar ?: $unit->slug)
            : ($unit->slug_en ?: $unit->slug);

        $description = $locale === 'ar'
            ? ($unit->description_ar ?? $unit->description ?? '')
            : ($unit->description_en ?? $unit->description ?? '');

        // Sanitize snippet
        $cleanSnippet = mb_substr(strip_tags((string) $description), 0, 200);

        $location = $locale === 'ar'
            ? ($unit->location_address_ar ?: $unit->location_address_en)
            : ($unit->location_address_en ?: $unit->location_address_ar);

        $price = (float) ($unit->price ?? 0);
        $currency = $locale === 'ar' ? 'ج.م' : 'EGP';
        $priceFormatted = number_format($price, 0, '.', ',');

        // Load agent/broker info if available via safe contact resolver
        $agent = !empty($unit->user_id)
            ? \App\Domain\Assistant\Services\AssistantContactResolver::resolveAgentContact((int) $unit->user_id)
            : null;

        $agentName = $agent['name'] ?? null;
        $agentPhone = $agent['phone'] ?? null;
        $agentWhatsapp = $agent['whatsapp'] ?? null;

        // WhatsApp inquiry URL: prefer direct agent WhatsApp if available, otherwise company WhatsApp
        $targetWa = !empty($agentWhatsapp)
            ? $agentWhatsapp
            : (string) ($companyWhatsapp ?: config('assistant.default_whatsapp', '201000000000'));
        $cleanPhone = preg_replace('/[^\d]/', '', (string) $targetWa);
        $waText = urlencode($locale === 'ar'
            ? "مرحباً، أود الاستفسار عن الوحدة: {$name}"
            : "Hello, I would like to inquire about unit: {$name}");
        $whatsappUrl = !empty($cleanPhone) ? "https://wa.me/{$cleanPhone}?text={$waText}" : null;

        return new self(
            id: (int) $unit->id,
            projectId: (int) $unit->project_id,
            name: htmlspecialchars((string) $name, ENT_QUOTES, 'UTF-8'),
            slug: (string) $slug,
            url: "/{$locale}/units/" . urlencode((string) $slug),
            imageUrl: '/images/fallback.webp',
            location: $location ? htmlspecialchars((string) $location, ENT_QUOTES, 'UTF-8') : null,
            price: $price,
            priceFormatted: $priceFormatted,
            currency: $currency,
            areaSqm: $unit->area_sqm !== null ? (float) $unit->area_sqm : null,
            rooms: (int) ($unit->rooms ?? 0),
            bathrooms: (int) ($unit->bathrooms ?? 0),
            transaction: $unit->transaction ? (string) $unit->transaction : null,
            paymentMethod: $unit->payment_method ? (string) $unit->payment_method : null,
            descriptionSnippet: $cleanSnippet ?: null,
            whatsappUrl: $whatsappUrl,
            agentName: $agentName,
            agentPhone: $agentPhone,
            agentWhatsapp: $agentWhatsapp,
        );
    }

    public function toCardPayload(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'url' => $this->url,
            'image_url' => $this->imageUrl,
            'area_name' => $this->location,
            'price' => $this->price,
            'price_formatted' => $this->priceFormatted,
            'currency' => $this->currency,
            'area_sqm' => $this->areaSqm,
            'rooms' => $this->rooms,
            'bathrooms' => $this->bathrooms,
            'transaction' => $this->transaction,
            'payment_method' => $this->paymentMethod,
            'whatsapp_url' => $this->whatsappUrl,
            'agent_name' => $this->agentName,
            'agent_phone' => $this->agentPhone,
            'agent_whatsapp' => $this->agentWhatsapp,
        ];
    }

    public function toLlmSnippet(): array
    {
        $snippet = [
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->priceFormatted . ' ' . $this->currency,
            'area_sqm' => $this->areaSqm,
            'rooms' => $this->rooms,
            'bathrooms' => $this->bathrooms,
            'transaction' => $this->transaction,
            'payment_method' => $this->paymentMethod,
            'description' => $this->descriptionSnippet,
            'location' => $this->location,
        ];

        if ($this->agentName) {
            $snippet['agent_name'] = $this->agentName;
        }
        if ($this->agentPhone) {
            $snippet['agent_phone'] = $this->agentPhone;
        }
        if ($this->agentWhatsapp) {
            $snippet['agent_whatsapp'] = $this->agentWhatsapp;
        }

        return $snippet;
    }
}
