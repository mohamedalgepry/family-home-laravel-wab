<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'daily_deduction_enabled' => 'nullable|in:0,1,true,false',
            'daily_deduction_value' => 'nullable|numeric|min:1|max:1000',
            'monthly_reset_day' => 'nullable|numeric|between:1,28',
            'monthly_reset_auto' => 'nullable|in:0,1,true,false',
            'auto_delete_days' => 'nullable|numeric|min:1|max:365',
            'site_logo' => 'nullable|file|image|max:10240',
            'hero_title_ar' => 'nullable|string|max:255',
            'hero_title_en' => 'nullable|string|max:255',
            'hero_subtitle_ar' => 'nullable|string|max:1000',
            'hero_subtitle_en' => 'nullable|string|max:1000',
            'hero_image' => 'nullable|file|image|max:15360',
            'company_phone' => 'nullable|string|max:50',
            'company_whatsapp' => 'nullable|string|max:50',
            'company_email' => 'nullable|string|max:255',
            'company_address' => 'nullable|string|max:500',
            'social_facebook' => 'nullable|string|max:500',
            'social_instagram' => 'nullable|string|max:500',
            'social_twitter' => 'nullable|string|max:500',
            'social_linkedin' => 'nullable|string|max:500',
        ];
    }
}
