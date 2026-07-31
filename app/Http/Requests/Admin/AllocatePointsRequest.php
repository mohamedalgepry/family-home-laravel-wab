<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AllocatePointsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isAdmin() || $this->user()->isManager());
    }

    public function rules(): array
    {
        return [
            'unit_id' => 'nullable|exists:units,id',
            'points' => 'required|integer',
            'notes' => 'nullable|string|max:500',
            'manager_id' => 'nullable|integer|exists:users,id',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $user = $this->user();

            if (! $user || ! $user->isAdmin()) {
                if (! $this->filled('unit_id')) {
                    $validator->errors()->add('unit_id', __('validation.required', ['attribute' => 'unit']));
                }

                $points = (int) $this->input('points', 0);
                if ($points < 1) {
                    $validator->errors()->add('points', __('points.must_be_positive'));
                }

                if ($this->filled('manager_id') && (int) $this->input('manager_id') !== $user->id) {
                    $validator->errors()->add('manager_id', __('points.cannot_allocate_for_others'));
                }
            }
        });
    }
}
