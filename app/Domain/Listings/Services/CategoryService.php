<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\DTOs\CreateCategoryData;
use App\Domain\Listings\Models\Category;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        private readonly SitemapService $sitemapService,
    ) {}

    public function getAll(): array
    {
        return Category::orderBy('name_ar')->get()->toArray();
    }

    public function create(CreateCategoryData $data): Category
    {
        $slug = $this->generateUniqueSlug($data->name_en);

        $category = Category::create([
            'name_ar' => $data->name_ar,
            'name_en' => $data->name_en,
            'slug' => $slug,
        ]);

        return $category;
    }

    public function update(int $id, CreateCategoryData $data): Category
    {
        $category = Category::findOrFail($id);

        $slug = $category->slug;
        if ($data->name_en !== $category->name_en) {
            $slug = $this->generateUniqueSlug($data->name_en, $id);
        }

        $category->update([
            'name_ar' => $data->name_ar,
            'name_en' => $data->name_en,
            'slug' => $slug,
        ]);

        return $category->fresh();
    }

    public function delete(int $id): void
    {
        $category = Category::findOrFail($id);
        $category->delete();
        $this->sitemapService->regenerate();
    }

    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $baseSlug = $slug;
        $counter = 1;

        $query = Category::where('slug', $slug);
        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists() && $counter < 100) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;

            $query = Category::where('slug', $slug);
            if ($excludeId !== null) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }
}
