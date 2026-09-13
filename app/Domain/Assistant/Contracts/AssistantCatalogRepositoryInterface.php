<?php

namespace App\Domain\Assistant\Contracts;

use App\Domain\Assistant\DTOs\ProjectPublicDTO;
use App\Domain\Assistant\DTOs\SafeUnitFiltersDTO;
use App\Domain\Assistant\DTOs\UnitPaginationDTO;
use App\Domain\Assistant\DTOs\UnitPublicDTO;

interface AssistantCatalogRepositoryInterface
{
    /**
     * Resolve an active project by slug.
     */
    public function findActiveProjectBySlug(string $slug, string $locale = 'ar'): ?ProjectPublicDTO;

    /**
     * Resolve an active unit by slug across catalog.
     */
    public function findActiveUnitBySlug(string $slug, string $locale = 'ar'): ?UnitPublicDTO;

    /**
     * List active projects for general exploration.
     *
     * @return ProjectPublicDTO[]
     */
    public function listActiveProjects(int $limit = 6, string $locale = 'ar'): array;

    /**
     * List active units belonging to a specific active project with pagination and safe filters.
     */
    public function listActiveUnitsForProject(
        string $projectSlug,
        SafeUnitFiltersDTO $filters,
        int $page = 1,
        int $perPage = 6,
        string $locale = 'ar'
    ): UnitPaginationDTO;

    /**
     * Get a specific active unit strictly verified within its active project (Anti-IDOR).
     */
    public function getActiveUnitInProject(
        string $projectSlug,
        string $unitSlug,
        string $locale = 'ar'
    ): ?UnitPublicDTO;

    /**
     * List active units with safe allowlisted filters and limits.
     *
     * @return UnitPublicDTO[]
     */
    public function listActiveUnits(
        SafeUnitFiltersDTO $filters,
        int $limit = 6,
        string $locale = 'ar'
    ): array;
}
