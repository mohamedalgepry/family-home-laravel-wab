<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\DTOs\UpdateAboutPageData;
use App\Domain\Listings\Models\AboutPage;
use Illuminate\Support\Facades\Cache;

class AboutService
{
    private const CACHE_KEY = 'about_page';

    private const CACHE_TTL = 3600;

    public function get(): AboutPage
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return AboutPage::firstOrCreate([], [
                'content_ar' => '',
                'content_en' => '',
                'images' => [],
            ]);
        });
    }

    public function update(UpdateAboutPageData $data): AboutPage
    {
        $about = AboutPage::firstOrCreate([], [
            'content_ar' => '',
            'content_en' => '',
            'images' => [],
        ]);

        $about->update([
            'content_ar' => $data->content_ar,
            'content_en' => $data->content_en,
            'images' => $data->images ?? [],
        ]);

        Cache::forget(self::CACHE_KEY);

        return $about->fresh();
    }
}
