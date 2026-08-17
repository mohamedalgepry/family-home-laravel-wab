<?php

namespace App\Support;

/**
 * Static allowlist of safe SVG icon names.
 *
 * RAW SVG strings from the database are NEVER rendered (stored XSS guard).
 * Only icon NAMES listed here may be sent to the public frontend, which maps
 * them to hardcoded inline SVG components. Unknown names degrade to a safe
 * default icon. This guarantees no HTML/SVG from user input ever executes.
 */
final class IconAllowlist
{
    private const ICONS = [
        'pool',
        'gym',
        'garden',
        'parking',
        'security',
        'elevator',
        'playground',
        'mosque',
        'mall',
        'smart_home',
        'rooftop',
        'wifi',
        'pet_friendly',
        'lake_view',
        'sea_view',
        'kids_area',
        'clubhouse',
        'spa',
        'sauna',
        'cinema',
        'running_track',
        'tennis',
        'basketball',
        'football',
        'bbq_area',
        'green_area',
        'electric_charging',
        'solar_panels',
        'cctv',
        'fire_alarm',
        'backup_generator',
        'water_tank',
        'laundry',
        'community_center',
        'prayer_room',
        'business_center',
        'concierge',
        'valet',
        'location',
        'school',
        'hospital',
        'shopping',
        'transport',
        'restaurant',
        'cafe',
        'park',
        'pharmacy',
        'bank',
        'atm',
        'supermarket',
        'metro',
        'station',
        'university',
        'clinic',
        'police',
        'fire_station',
        'library',
        'stadium',
        'hotel',
        'airport',
        'beach',
        'club',
        'market',
        'gas_station',
        'post_office',
        'embassy',
        'zoo',
        'museum',
        'theater',
        'default',
    ];

    private const PATTERN = '/^[a-z0-9][a-z0-9_-]{0,49}$/';

    /**
     * Whether the given value is a safe, allowlisted icon NAME.
     * Any value that is not a plain allowlisted name (e.g. markup like
     * "<svg ...>", URLs, or arbitrary strings) is rejected.
     */
    public static function isAllowed(string $value): bool
    {
        $value = trim($value);

        if ($value === '') {
            return false;
        }

        if (preg_match(self::PATTERN, $value) !== 1) {
            return false;
        }

        return in_array($value, self::ICONS, true);
    }

    /**
     * Normalize a stored icon value into a safe allowlisted name.
     * Returns null when the value is not a known safe icon name.
     */
    public static function safeName(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        return self::isAllowed($value) ? trim($value) : null;
    }
}
