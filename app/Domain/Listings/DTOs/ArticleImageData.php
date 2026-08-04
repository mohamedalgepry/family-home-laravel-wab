<?php

namespace App\Domain\Listings\DTOs;

/**
 * Carries per-image metadata for article image persistence.
 * Keeps service method signatures short and intention-revealing.
 */
final class ArticleImageData
{
    public function __construct(
        public readonly array $paths,
        public readonly array $alts = [],
        public readonly array $positions = [],
        public readonly array $links = [],
    ) {}

    public static function empty(): self
    {
        return new self(paths: []);
    }

    public function hasImages(): bool
    {
        return ! empty($this->paths);
    }

    public function metaForIndex(int $index): array
    {
        return [
            'alt_text' => $this->alts[$index] ?? null,
            'link_url' => $this->links[$index] ?? null,
            'position' => $this->positions[$index] ?? 'middle',
        ];
    }
}
