<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Services\SettingsService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Services\PrerenderService;
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
            unset($data['site_logo'], $data['hero_image'], $data['hero_image_mobile']);

            $this->storeSettingImage($request, 'site_logo', $data);
            $this->storeSettingImage($request, 'hero_image', $data);

            $this->settingsService->updateMany($data);

            // Surgically patch pre-rendered Home HTML files immediately
            app(PrerenderService::class)->patchHomeHtml();

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
        $file = $request->file($field);

        $disk = Storage::disk('public');
        $filename = uniqid($field.'_').'.webp';
        $relativeWebpPath = 'settings/'.$filename;
        $fullWebpPath = $disk->path($relativeWebpPath);

        if (! $disk->exists('settings')) {
            $disk->makeDirectory('settings');
        }

        $processed = false;
        try {
            $raw = file_get_contents($file->getRealPath());
            if ($raw && function_exists('imagecreatefromstring') && function_exists('imagewebp')) {
                $srcImg = @imagecreatefromstring($raw);
                if ($srcImg) {
                    $w = imagesx($srcImg);
                    $h = imagesy($srcImg);

                    $maxW = $field === 'hero_image' ? 1400 : 800;
                    if ($w > $maxW) {
                        $targetW = $maxW;
                        $targetH = (int) round(($h / $w) * $targetW);
                        $dstImg = imagecreatetruecolor($targetW, $targetH);
                        imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $targetW, $targetH, $w, $h);
                        imagewebp($dstImg, $fullWebpPath, 82);
                        imagedestroy($dstImg);
                    } else {
                        imagewebp($srcImg, $fullWebpPath, 82);
                    }

                    // إذا كانت الصورة الرئيسية للهيرو، ننشئ نسخة مخصصة للموبايل أيضاً
                    if ($field === 'hero_image') {
                        $oldMobilePath = $this->settingsService->get('hero_image_mobile');
                        $mobileFilename = uniqid('hero_mobile_').'.webp';
                        $relativeMobilePath = 'settings/'.$mobileFilename;
                        $fullMobilePath = $disk->path($relativeMobilePath);

                        $targetMobileW = min($w, 640);
                        $targetMobileH = (int) round(($h / $w) * $targetMobileW);
                        $dstMobile = imagecreatetruecolor($targetMobileW, $targetMobileH);
                        imagecopyresampled($dstMobile, $srcImg, 0, 0, 0, 0, $targetMobileW, $targetMobileH, $w, $h);
                        imagewebp($dstMobile, $fullMobilePath, 80);
                        imagedestroy($dstMobile);

                        $data['hero_image_mobile'] = $relativeMobilePath;
                        if ($oldMobilePath && $oldMobilePath !== $relativeMobilePath && $disk->exists($oldMobilePath)) {
                            $disk->delete($oldMobilePath);
                        }
                    }

                    imagedestroy($srcImg);
                    $processed = true;
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Failed to optimize setting image {$field}: ".$e->getMessage());
        }

        if (! $processed) {
            $path = $file->store('settings', 'public');
            if ($path) {
                $data[$field] = $path;
            }
        } else {
            $data[$field] = $relativeWebpPath;
        }

        if (isset($data[$field]) && $oldPath && $oldPath !== $data[$field] && $disk->exists($oldPath)) {
            $disk->delete($oldPath);
        }
    }
}
