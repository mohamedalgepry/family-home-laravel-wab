<?php

namespace App\Domain\Assistant\DTOs;

class ProjectPublicDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $slug,
        public readonly string $url,
        public readonly ?string $descriptionSnippet,
        public readonly ?string $paymentMethod,
        public readonly ?float $downPayment,
        public readonly ?int $installmentYears,
        public readonly ?string $locationAddress,
        public readonly ?string $agentName,
        public readonly ?string $agentPhone,
        public readonly ?string $agentWhatsapp,
    ) {}

    public static function fromModel(object $project, string $locale = 'ar'): self
    {
        $name = $locale === 'ar'
            ? ($project->name_ar ?? $project->name ?? '')
            : ($project->name_en ?? $project->name ?? '');

        $slug = $locale === 'ar'
            ? ($project->slug_ar ?: $project->slug)
            : ($project->slug_en ?: $project->slug);

        $description = $locale === 'ar'
            ? ($project->description_ar ?? $project->description ?? '')
            : ($project->description_en ?? $project->description ?? '');

        // Strip HTML, trim, and cap at 300 chars to avoid prompt bloat or stored prompt injection
        $cleanDescription = mb_substr(strip_tags((string) $description), 0, 300);

        $locationAddress = $locale === 'ar'
            ? ($project->location_address_ar ?: $project->location_address_en)
            : ($project->location_address_en ?: $project->location_address_ar);

        // Load agent/broker info if available via safe contact resolver
        $agent = !empty($project->user_id)
            ? \App\Domain\Assistant\Services\AssistantContactResolver::resolveAgentContact((int) $project->user_id)
            : null;

        $agentName = $agent['name'] ?? null;
        $agentPhone = $agent['phone'] ?? null;
        $agentWhatsapp = $agent['whatsapp'] ?? null;

        return new self(
            id: (int) $project->id,
            name: htmlspecialchars((string) $name, ENT_QUOTES, 'UTF-8'),
            slug: (string) $slug,
            url: "/{$locale}/projects/" . urlencode((string) $slug),
            descriptionSnippet: $cleanDescription ?: null,
            paymentMethod: $project->payment_method ? (string) $project->payment_method : null,
            downPayment: $project->down_payment !== null ? (float) $project->down_payment : null,
            installmentYears: $project->installment_years !== null ? (int) $project->installment_years : null,
            locationAddress: $locationAddress ? htmlspecialchars((string) $locationAddress, ENT_QUOTES, 'UTF-8') : null,
            agentName: $agentName,
            agentPhone: $agentPhone,
            agentWhatsapp: $agentWhatsapp,
        );
    }

    public function toSafeArray(): array
    {
        $data = [
            'name' => $this->name,
            'slug' => $this->slug,
            'url' => $this->url,
            'description' => $this->descriptionSnippet,
            'payment_method' => $this->paymentMethod,
            'down_payment' => $this->downPayment,
            'installment_years' => $this->installmentYears,
            'location' => $this->locationAddress,
        ];

        if ($this->agentName) {
            $data['agent_name'] = $this->agentName;
        }
        if ($this->agentPhone) {
            $data['agent_phone'] = $this->agentPhone;
        }
        if ($this->agentWhatsapp) {
            $data['agent_whatsapp'] = $this->agentWhatsapp;
        }

        return $data;
    }
}
