<?php

namespace App\Domain\Assistant\DTOs;

class UnitPaginationDTO
{
    /**
     * @param UnitPublicDTO[] $items
     */
    public function __construct(
        public readonly array $items,
        public readonly int $currentPage,
        public readonly int $perPage,
        public readonly int $total,
        public readonly int $lastPage,
        public readonly bool $hasMore,
        public readonly ?string $projectSlug = null,
        public readonly ?string $projectName = null,
    ) {}

    public function toCardPayload(): array
    {
        return array_map(fn(UnitPublicDTO $dto) => $dto->toCardPayload(), $this->items);
    }

    public function toLlmSnippet(): array
    {
        return [
            'project_name' => $this->projectName,
            'project_slug' => $this->projectSlug,
            'page' => $this->currentPage,
            'total_units' => $this->total,
            'has_more' => $this->hasMore,
            'units' => array_map(fn(UnitPublicDTO $dto) => $dto->toLlmSnippet(), $this->items),
        ];
    }
}
