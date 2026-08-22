<?php

namespace App\Http\Requests\Admin;

use App\Domain\Listings\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;

class ExtendUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'duration_type' => 'nullable|string|in:7_days,15_days,30_days,auto_delete_setting,custom',
            'days' => [
                'nullable',
                'integer',
                'min:1',
                'max:365',
                'required_if:duration_type,custom',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'days.min' => 'عدد الأيام يجب أن يكون 1 على الأقل.',
            'days.max' => 'الحد الأقصى للتمديد هو 365 يوماً.',
            'days.required_if' => 'يرجى تحديد عدد الأيام عند اختيار مدة مخصصة.',
        ];
    }

    public function getResolvedDays(): int
    {
        $durationType = $this->input('duration_type');

        if ($durationType === '7_days') {
            return 7;
        }

        if ($durationType === '15_days') {
            return 15;
        }

        if ($durationType === '30_days') {
            return 30;
        }

        if ($durationType === 'auto_delete_setting') {
            $settingDays = (int) Setting::getValue('auto_delete_days', '30');

            return $settingDays > 0 ? $settingDays : 30;
        }

        if ($durationType === 'custom' || $this->filled('days')) {
            $customDays = (int) $this->input('days');

            return $customDays > 0 ? $customDays : 30;
        }

        // Default fallback to setting value if no duration_type or days provided
        $defaultSetting = (int) Setting::getValue('auto_delete_days', '30');

        return $defaultSetting > 0 ? $defaultSetting : 30;
    }
}
