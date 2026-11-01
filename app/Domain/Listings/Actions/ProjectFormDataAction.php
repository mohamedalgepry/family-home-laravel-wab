<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Users\Models\User;

/**
 * Builds the shared lookup payload for the admin project create/edit forms.
 */
class ProjectFormDataAction
{
    public function execute(): array
    {
        return [
            'areas' => Area::select('id', 'name_ar', 'name_en')->orderBy('name_ar')->get(),
            'features' => Feature::select('id', 'name_ar', 'name_en')->get(),
            'finishingTypes' => FinishingType::select('id', 'name_ar', 'name_en')->get(),
            'managers' => User::whereIn('role', ['admin', 'manager'])->select('id', 'name', 'role')->orderBy('name')->get(),
        ];
    }
}
