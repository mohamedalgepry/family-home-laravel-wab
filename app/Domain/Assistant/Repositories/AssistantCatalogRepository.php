<?php

namespace App\Domain\Assistant\Repositories;

use App\Domain\Assistant\Contracts\AssistantCatalogRepositoryInterface;
use App\Domain\Assistant\DTOs\ProjectPublicDTO;
use App\Domain\Assistant\DTOs\SafeUnitFiltersDTO;
use App\Domain\Assistant\DTOs\UnitPaginationDTO;
use App\Domain\Assistant\DTOs\UnitPublicDTO;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;

class AssistantCatalogRepository implements AssistantCatalogRepositoryInterface
{
    private const PROJECT_SELECT_COLUMNS = [
        'id', 'name', 'name_ar', 'name_en',
        'slug', 'slug_ar', 'slug_en',
        'description', 'description_ar', 'description_en',
        'payment_method', 'down_payment', 'installment_years',
        'location_address_ar', 'location_address_en', 'is_active',
    ];

    private const UNIT_SELECT_COLUMNS = [
        'id', 'project_id', 'name', 'name_ar', 'name_en',
        'slug', 'slug_ar', 'slug_en',
        'description', 'description_ar', 'description_en',
        'transaction', 'price', 'area_sqm', 'rooms', 'bathrooms',
        'payment_method', 'down_payment', 'installment_years',
        'location_address_ar', 'location_address_en', 'is_active',
    ];

    public function __construct(
        private readonly ?string $connectionName = null,
    ) {}

    public function getConnectionName(): string
    {
        if ($this->connectionName) {
            return $this->connectionName;
        }

        if (app()->environment('testing')) {
            return config('assistant.db_connection_testing') ?: config('database.default', 'mysql');
        }

        return config('assistant.db_connection') ?: 'assistant_readonly';
    }

    /**
     * Resolve an active project by slug.
     */
    public function findActiveProjectBySlug(string $slug, string $locale = 'ar'): ?ProjectPublicDTO
    {
        $cleanSlug = trim($slug);
        if (empty($cleanSlug)) {
            return null;
        }

        $project = Project::on($this->getConnectionName())
            ->select(self::PROJECT_SELECT_COLUMNS)
            ->where('is_active', true)
            ->where(function ($q) use ($cleanSlug) {
                $q->where('slug', $cleanSlug)
                  ->orWhere('slug_ar', $cleanSlug)
                  ->orWhere('slug_en', $cleanSlug);
            })
            ->first();

        return $project ? ProjectPublicDTO::fromModel($project, $locale) : null;
    }

    /**
     * List active projects for general exploration.
     */
    public function listActiveProjects(int $limit = 6, string $locale = 'ar'): array
    {
        $safeLimit = max(1, min(12, $limit));

        $projects = Project::on($this->getConnectionName())
            ->select(self::PROJECT_SELECT_COLUMNS)
            ->where('is_active', true)
            ->orderBy('id', 'desc')
            ->limit($safeLimit)
            ->get();

        return $projects->map(fn($p) => ProjectPublicDTO::fromModel($p, $locale))->all();
    }

    /**
     * List active units belonging to a specific active project with pagination and safe filters.
     * Supports: "ما الوحدات التابعة لمشروع X؟" with pagination.
     */
    public function listActiveUnitsForProject(
        string $projectSlug,
        SafeUnitFiltersDTO $filters,
        int $page = 1,
        int $perPage = 6,
        string $locale = 'ar'
    ): UnitPaginationDTO {
        $project = $this->findActiveProjectBySlug($projectSlug, $locale);
        if (!$project) {
            return new UnitPaginationDTO(
                items: [],
                currentPage: 1,
                perPage: $perPage,
                total: 0,
                lastPage: 1,
                hasMore: false,
                projectSlug: $projectSlug,
                projectName: null
            );
        }

        $safePage = max(1, min(5, $page));
        $safePerPage = max(1, min(12, $perPage));

        $query = Unit::on($this->getConnectionName())
            ->select(self::UNIT_SELECT_COLUMNS)
            ->where('project_id', $project->id)
            ->where('is_active', true);

        // Apply allowlisted typed filters (Zero raw SQL)
        if ($filters->transaction !== null) {
            $query->where('transaction', $filters->transaction);
        }

        if ($filters->minPrice !== null) {
            $query->where('price', '>=', $filters->minPrice);
        }

        if ($filters->maxPrice !== null) {
            $query->where('price', '<=', $filters->maxPrice);
        }

        if ($filters->rooms !== null) {
            $query->where('rooms', $filters->rooms);
        }

        if ($filters->bathrooms !== null) {
            $query->where('bathrooms', $filters->bathrooms);
        }

        if ($filters->minAreaSqm !== null) {
            $query->where('area_sqm', '>=', $filters->minAreaSqm);
        }

        if ($filters->maxAreaSqm !== null) {
            $query->where('area_sqm', '<=', $filters->maxAreaSqm);
        }

        if ($filters->paymentMethod !== null) {
            $query->where('payment_method', $filters->paymentMethod);
        }

        // Apply safe sort
        match ($filters->sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            default => $query->orderBy('id', 'desc'),
        };

        $total = $query->count();
        $lastPage = max(1, (int) ceil($total / $safePerPage));
        $offset = ($safePage - 1) * $safePerPage;

        $units = $query->offset($offset)->limit($safePerPage)->get();

        $items = $units->map(fn($u) => UnitPublicDTO::fromModel($u, $locale))->all();
        $hasMore = $safePage < $lastPage;

        return new UnitPaginationDTO(
            items: $items,
            currentPage: $safePage,
            perPage: $safePerPage,
            total: $total,
            lastPage: $lastPage,
            hasMore: $hasMore,
            projectSlug: $project->slug,
            projectName: $project->name
        );
    }

    /**
     * Get a specific active unit strictly verified within its active project (Anti-IDOR).
     */
    public function getActiveUnitInProject(
        string $projectSlug,
        string $unitSlug,
        string $locale = 'ar'
    ): ?UnitPublicDTO {
        $cleanProjectSlug = trim($projectSlug);
        $cleanUnitSlug = trim($unitSlug);

        if (empty($cleanProjectSlug) || empty($cleanUnitSlug)) {
            return null;
        }

        // 1. Resolve active project first
        $project = $this->findActiveProjectBySlug($cleanProjectSlug, $locale);
        if (!$project) {
            return null;
        }

        // 2. Strict IDOR protection: unit MUST belong to this project and be active
        $unit = Unit::on($this->getConnectionName())
            ->select(self::UNIT_SELECT_COLUMNS)
            ->where('project_id', $project->id)
            ->where('is_active', true)
            ->where(function ($q) use ($cleanUnitSlug) {
                $q->where('slug', $cleanUnitSlug)
                  ->orWhere('slug_ar', $cleanUnitSlug)
                  ->orWhere('slug_en', $cleanUnitSlug);
            })
            ->first();

        return $unit ? UnitPublicDTO::fromModel($unit, $locale) : null;
    }
}
