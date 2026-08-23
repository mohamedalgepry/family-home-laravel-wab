<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    private const CACHE_KEY = 'settings_all';

    private const CACHE_TTL = 3600;

    /** الحقول البوليانية فقط — تُحفظ كـ true/false */
    private const BOOLEAN_KEYS = [
        'daily_deduction_enabled',
        'monthly_reset_auto',
    ];

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->getAll()[$key] ?? $default;
    }

    public function set(string $key, mixed $value): void
    {
        Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $this->normalizeValue($key, $value)],
        );

        $this->clearCache();
    }

    public function getAll(): array
    {
        try {
            return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
                return Setting::pluck('value', 'key')->toArray();
            });
        } catch (\Throwable $e) {
            return [];
        }
    }

    public function updateMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $this->normalizeValue($key, $value)],
            );
        }

        $this->clearCache();
    }

    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /** Returns typed points configuration values. */
    public function getPointsConfig(): array
    {
        return [
            'daily_deduction_enabled' => $this->getBool('daily_deduction_enabled'),
            'daily_deduction_value' => (int) $this->get('daily_deduction_value', '10'),
            'monthly_reset_day' => (int) $this->get('monthly_reset_day', '1'),
            'monthly_reset_auto' => $this->getBool('monthly_reset_auto'),
        ];
    }

    public function getBool(string $key, bool $default = false): bool
    {
        $value = $this->get($key);

        if ($value === null) {
            return $default;
        }

        return in_array($value, ['true', '1', true], true);
    }

    private function normalizeValue(string $key, mixed $value): string
    {
        // الحقول البوليانية: تُحفظ كـ true/false
        if (in_array($key, self::BOOLEAN_KEYS, true)) {
            if (is_bool($value)) {
                return $value ? 'true' : 'false';
            }

            return in_array($value, ['1', 'true', true], true) ? 'true' : 'false';
        }

        // باقي الحقول: تُحفظ كما هي
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        return (string) $value;
    }
}
