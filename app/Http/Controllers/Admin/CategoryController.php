<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\DTOs\CreateCategoryData;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Services\CategoryService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Category::class);

        $categories = $this->categoryService->getAll();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $this->authorize('create', Category::class);
        $data = CreateCategoryData::from($request->validated());

        $this->categoryService->create($data);

        return redirect()->route('admin.categories.index')
            ->with('success', __('common.added_successfully'));
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $this->authorize('update', $category);

        $data = CreateCategoryData::from($request->validated());

        $this->categoryService->update($category->id, $data);

        return redirect()->route('admin.categories.index')
            ->with('success', __('common.updated_successfully'));
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorize('delete', $category);

        $this->categoryService->delete($category->id);

        return redirect()->route('admin.categories.index')
            ->with('success', __('common.deleted_successfully'));
    }
}
