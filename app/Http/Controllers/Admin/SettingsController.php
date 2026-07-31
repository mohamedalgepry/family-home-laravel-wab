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

            $this->storeSettingImage($request, 'site_logo', $data);
            $this->storeSettingImage($request, 'hero_image', $data);

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

    private function storeSettingImage(UpdateSettingsRequest $request, string $field, array &$data): void
    {
        if (! $request->hasFile($field)) {
            return;
        }

        $oldPath = $this->settingsService->get($field);
        $path = $request->file($field)->store('settings', 'public');

        if ($path) {
            $data[$field] = $path;

            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }
}
