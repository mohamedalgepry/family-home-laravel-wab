<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Common\QueryBuilders\UserScopeQueryBuilder;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\User;

/**
 * Builds the shared lookup payload for the admin unit create/edit forms.
 */
class UnitFormDataAction
{
    public function execute(User $user): array
    {
        $projects = Project::select('id', 'name_ar', 'name_en');
        UserScopeQueryBuilder::applyOwnershipScope($projects, $user);

        return [
            'areas' => Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'unitTypes' => UnitType::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'projects' => $projects->orderBy('name_en')->get(),
            'features' => Feature::select('id', 'name_ar', 'name_en')->get(),
            'finishingTypes' => FinishingType::select('id', 'name_ar', 'name_en')->get(),
            'managers' => User::whereIn('role', ['admin', 'manager', 'agent'])->select('id', 'name', 'role')->orderBy('name')->get(),
        ];
    }
}
