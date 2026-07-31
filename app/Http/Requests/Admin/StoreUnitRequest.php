<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Unit;

class StoreUnitRequest extends UnitFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Unit::class) ?? false;
    }
}
