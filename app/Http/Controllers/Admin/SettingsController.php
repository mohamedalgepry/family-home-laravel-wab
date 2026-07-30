<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Services\SettingsService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(
        private readonly SettingsService $settingsService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Setting::class);

        $settings = $this->settingsService->getAll();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        try {
            $this->authorize('update', Setting::class);
            $data = $request->validated();

            // إزالة الحقول الفارغة أو null (غير المرسلة)
            unset($data['site_logo'], $data['hero_image']);

            // رفع الشعار
            if ($request->hasFile('site_logo')) {
                $oldLogo = $this->settingsService->get('site_logo');
                $path = $request->file('site_logo')->store('settings', 'public');
                if ($path) {
                    $data['site_logo'] = $path;
                    if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
                        Storage::disk('public')->delete($oldLogo);
                    }
                }
            }

            // رفع صورة الغلاف
            if ($request->hasFile('hero_image')) {
                $oldHero = $this->settingsService->get('hero_image');
                $path = $request->file('hero_image')->store('settings', 'public');
                if ($path) {
                    $data['hero_image'] = $path;
                    if ($oldHero && Storage::disk('public')->exists($oldHero)) {
                        Storage::disk('public')->delete($oldHero);
                    }
                }
            }

            $this->settingsService->updateMany($data);

            Log::info('Settings updated successfully.', ['keys' => array_keys($data)]);

            return redirect()->route('admin.settings.index')
                ->with('success', __('common.updated_successfully'));

        } catch (\Throwable $e) {
            Log::error('Settings update failed.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->route('admin.settings.index')
                ->with('error', __('common.error_occurred'));
        }
    }
}
