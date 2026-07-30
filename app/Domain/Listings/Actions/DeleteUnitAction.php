<?php

namespace App\Domain\Listings\Actions;

use App\Domain\Listings\Models\Unit;

class DeleteUnitAction
{
    public function execute(int $unitId): void
    {
        $unit = Unit::findOrFail($unitId);
        $unit->delete();
    }
}
