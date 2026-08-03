<?php

namespace App\Http\Middleware;

use App\Domain\Listings\Models\PageSeo;
use App\Domain\Listings\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $locale = session('locale', app()->getLocale());

        $user = $request->user();

        $allSettings = [];
        try {
            $allSettings = app(SettingsService::class)->getAll();
        } catch (\Throwable $e) {
            \Log::warning('SettingsService failed in HandleInertiaRequests', ['error' => $e->getMessage()]);
            $allSettings = [];
        }

        $settingKeys = [
            'site_logo', 'hero_title_ar', 'hero_title_en', 'hero_subtitle_ar',
            'hero_subtitle_en', 'hero_image', 'hero_image_mobile', 'company_phone', 'company_whatsapp', 'company_email',
            'company_address', 'social_facebook', 'social_instagram', 'social_twitter', 'social_linkedin',
        ];

        $sharedSettings = [];
        foreach ($settingKeys as $key) {
            $sharedSettings[$key] = $allSettings[$key] ?? null;
        }

        $unreadCount = 0;
        if ($user) {
            $unreadCount = Cache::remember(
                "user_{$user->id}_unread_count",
                60,
                fn () => $user->unreadNotifications()->count()
            );
        }

        $seoPages = [];
        try {
            $seoPages = Cache::remember('seo_pages_cache', 3600, function () {
                return PageSeo::all()->keyBy('page_key')->toArray();
            });
        } catch (\Throwable $e) {
            \Log::warning('PageSeo failed in HandleInertiaRequests', ['error' => $e->getMessage()]);
            $seoPages = [];
        }

        return [
            ...parent::share($request),
            'appUrl' => config('app.url'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->loadMissing('profile')->profile?->avatar,
                    'phone' => $user->profile?->phone,
                    'whatsapp' => $user->profile?->whatsapp,
                    'facebook' => $user->profile?->facebook,
                    'linkedin' => $user->profile?->linkedin,
                    'points_balance' => $user->points_balance,
                ] : null,
            ],
            'locale' => $locale,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'info' => $request->session()->get('info'),
            ],
            'unread_notifications_count' => $unreadCount,
            'settings' => $sharedSettings,
            'seo_pages' => $seoPages,
        ];
    }
}
