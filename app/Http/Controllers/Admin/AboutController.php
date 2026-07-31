<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Actions\StoreUploadedImagesAction;
use App\Domain\Listings\DTOs\UpdateAboutPageData;
use App\Domain\Listings\Models\AboutPage;
use App\Domain\Listings\Services\AboutService;
use App\Domain\Common\Support\Sanitizer;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAboutPageRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __construct(
        private readonly AboutService $aboutService,
        private readonly StoreUploadedImagesAction $storeUploadedImagesAction,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', AboutPage::class);

        $about = $this->aboutService->get();

        return Inertia::render('Admin/About/Edit', [
            'about' => $about,
        ]);
    }

    public function update(UpdateAboutPageRequest $request): RedirectResponse
    {
        $this->authorize('update', AboutPage::class);

        $data = $request->validated();

        $about = $this->aboutService->get();
        $existingImages = $about->images ?? [];

        $deletedImages = $data['deleted_images'] ?? [];
        $remainingImages = array_values(array_filter(
            $existingImages,
            fn (string $path) => ! in_array($path, $deletedImages, true)
        ));

        foreach ($deletedImages as $path) {
            Storage::disk('public')->delete($path);
        }

        $newPaths = $this->storeUploadedImagesAction->execute($request->file('images', []), 'about');
        $mergedImages = array_merge($remainingImages, $newPaths);

        $aboutData = UpdateAboutPageData::from([
            'content_ar' => Sanitizer::rich($data['content_ar'] ?? ''),
            'content_en' => Sanitizer::rich($data['content_en'] ?? ''),
            'images' => $mergedImages,
        ]);

        $this->aboutService->update($aboutData);

        return redirect()->route('admin.about.edit')
            ->with('success', __('common.updated_successfully'));
    }
}
