<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Unit;

class UpdateUnitRequest extends UnitFormRequest
{
    public function authorize(): bool
    {
        $unit = $this->route('unit');

        return $unit instanceof Unit
            && ($this->user()?->can('update', $unit) ?? false);
    }
}
