<?php

namespace App\Domain\Assistant\Services;

use App\Domain\Assistant\Contracts\AssistantCatalogRepositoryInterface;
use App\Domain\Assistant\DTOs\ProjectPublicDTO;
use App\Domain\Assistant\DTOs\SafeUnitFiltersDTO;
use App\Domain\Assistant\DTOs\UnitPaginationDTO;
use App\Domain\Assistant\DTOs\UnitPublicDTO;

class RestrictedAssistantCatalogService
{
    public function __construct(
        private readonly AssistantCatalogRepositoryInterface $repository,
    ) {}

    /**
     * Tool 1: find_project
     * Retrieves public details of a single active project by its slug.
     */
    public function findProject(string $projectSlug, string $locale = 'ar'): ?ProjectPublicDTO
    {
        return $this->repository->findActiveProjectBySlug($projectSlug, $locale);
    }

    /**
     * Tool 2: list_units_for_project
     * Retrieves active units belonging to a specific active project with pagination and safe filters.
     * Supports: "ما الوحدات التابعة لمشروع X؟"
     */
    public function listUnitsForProject(
        string $projectSlug,
        array $filters = [],
        int $page = 1,
        int $perPage = 6,
        string $locale = 'ar'
    ): UnitPaginationDTO {
        $safeFilters = SafeUnitFiltersDTO::fromArray($filters);
        $safePerPage = max(1, min((int) config('assistant.max_per_page', 12), $perPage));

        return $this->repository->listActiveUnitsForProject(
            projectSlug: $projectSlug,
            filters: $safeFilters,
            page: $page,
            perPage: $safePerPage,
            locale: $locale
        );
    }

    /**
     * Tool 3: get_unit_in_project
     * Retrieves a single active unit within an active project (Anti-IDOR).
     */
    public function getUnitInProject(string $projectSlug, string $unitSlug, string $locale = 'ar'): ?UnitPublicDTO
    {
        return $this->repository->getActiveUnitInProject($projectSlug, $unitSlug, $locale);
    }

    /**
     * Tool 4: list_projects (exploration)
     * Lists active projects for general user orientation.
     *
     * @return ProjectPublicDTO[]
     */
    public function listProjects(int $limit = 6, string $locale = 'ar'): array
    {
        return $this->repository->listActiveProjects($limit, $locale);
    }

    /**
     * Tool calling dispatcher with strict schema validation and allowlist.
     * Rejects any tool not in the allowlist.
     */
    public function executeTool(string $toolName, array $arguments, string $locale = 'ar'): array
    {
        return match ($toolName) {
            'find_project' => $this->handleFindProject($arguments, $locale),
            'list_units_for_project' => $this->handleListUnitsForProject($arguments, $locale),
            'get_unit_in_project' => $this->handleGetUnitInProject($arguments, $locale),
            'list_projects' => $this->handleListProjects($arguments, $locale),
            default => [
                'error' => 'Disallowed or unknown tool',
                'tool' => htmlspecialchars($toolName, ENT_QUOTES, 'UTF-8'),
            ],
        };
    }

    private function handleFindProject(array $arguments, string $locale): array
    {
        $slug = (string) ($arguments['project_slug'] ?? $arguments['slug'] ?? '');
        $project = $this->findProject($slug, $locale);

        return $project ? ['found' => true, 'project' => $project->toSafeArray()] : ['found' => false, 'message' => 'Project not found'];
    }

    private function handleListUnitsForProject(array $arguments, string $locale): array
    {
        $projectSlug = (string) ($arguments['project_slug'] ?? '');
        $filters = (array) ($arguments['filters'] ?? []);
        $page = isset($arguments['page']) && is_numeric($arguments['page']) ? (int) $arguments['page'] : 1;
        $perPage = isset($arguments['per_page']) && is_numeric($arguments['per_page']) ? (int) $arguments['per_page'] : 6;

        $pagination = $this->listUnitsForProject($projectSlug, $filters, $page, $perPage, $locale);

        return [
            'found' => $pagination->total > 0,
            'pagination' => $pagination->toLlmSnippet(),
            'recommended_units' => $pagination->toCardPayload(),
        ];
    }

    private function handleGetUnitInProject(array $arguments, string $locale): array
    {
        $projectSlug = (string) ($arguments['project_slug'] ?? '');
        $unitSlug = (string) ($arguments['unit_slug'] ?? '');

        $unit = $this->getUnitInProject($projectSlug, $unitSlug, $locale);

        return $unit
            ? ['found' => true, 'unit' => $unit->toLlmSnippet(), 'recommended_units' => [$unit->toCardPayload()]]
            : ['found' => false, 'message' => 'Unit not found in project'];
    }

    private function handleListProjects(array $arguments, string $locale): array
    {
        $limit = isset($arguments['limit']) && is_numeric($arguments['limit']) ? (int) $arguments['limit'] : 6;
        $projects = $this->listProjects($limit, $locale);

        return [
            'projects' => array_map(fn(ProjectPublicDTO $p) => $p->toSafeArray(), $projects),
        ];
    }
}
