<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class AdjustPointsRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only admins may perform arbitrary point adjustments.
        // Managers allocate from their own balance via /admin/points/allocate.
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'points' => ['required', 'integer', 'min:0', 'max:100000'],
        ];
    }
}
