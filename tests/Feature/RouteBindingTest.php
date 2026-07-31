<?php

use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;

beforeEach(function () {
    $this->admin = new User(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => 'x']);
    $this->admin->role = 'admin';
    $this->admin->save();

    $type = UnitType::create(['name_ar' => 'نوع', 'name_en' => 'Type']);
    $area = Area::create(['name_ar' => 'منطقة', 'name_en' => 'Area']);

    $this->unit = Unit::create([
        'user_id' => $this->admin->id,
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 1000,
        'name' => 'Villa',
        'name_ar' => 'فيلا',
        'name_en' => 'Villa',
        'slug' => 'villa-nile',
    ]);

    $this->numericSlugUnit = Unit::create([
        'user_id' => $this->admin->id,
        'type_id' => $type->id,
        'area_id' => $area->id,
        'transaction' => 'sale',
        'price' => 2000,
        'name' => 'Tower',
        'name_ar' => 'برج',
        'name_en' => 'Tower',
        'slug' => '123',
    ]);
});

it('binds admin unit routes by id only', function () {
    $this->actingAs($this->admin)
        ->get("/admin/units/{$this->unit->id}/edit")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Units/Form'));
});

it('does not resolve a numeric slug as an id on admin routes', function () {
    $this->actingAs($this->admin)
        ->get('/admin/units/123/edit')
        ->assertNotFound();
});

it('resolves the right unit when a numeric slug collides with an id', function () {
    $collision = Unit::create([
        'user_id' => $this->admin->id,
        'type_id' => $this->unit->type_id,
        'area_id' => $this->unit->area_id,
        'transaction' => 'sale',
        'price' => 3000,
        'name' => 'Collision',
        'name_ar' => 'تصادم',
        'name_en' => 'Collision',
        'slug' => (string) $this->unit->id,
    ]);

    $this->actingAs($this->admin)
        ->get("/admin/units/{$this->unit->id}/edit")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('unit.id', $this->unit->id)
            ->where('unit.slug', $this->unit->slug));

    $collision->forceDelete();
});

it('binds public contact routes by slug only', function () {
    $this->post("/units/{$this->unit->slug}/contact", [
        'client_name' => 'Ahmed',
        'client_phone' => '01000000000',
        'content' => 'Hello',
    ])->assertRedirect();

    expect(Message::where('unit_id', $this->unit->id)->count())->toBe(1);
});

it('does not resolve an id on public contact routes', function () {
    $this->post("/units/{$this->unit->id}/contact", [
        'client_name' => 'Ahmed',
        'content' => 'Hello',
    ])->assertNotFound();

    expect(Message::count())->toBe(0);
});

it('returns 404 for an unknown slug on public contact routes', function () {
    $this->post('/units/does-not-exist/contact', [
        'client_name' => 'Ahmed',
        'content' => 'Hello',
    ])->assertNotFound();
});

it('binds admin project routes by id only', function () {
    $project = Project::create([
        'user_id' => $this->admin->id,
        'name' => 'Project',
        'name_ar' => 'مشروع',
        'name_en' => 'Project',
        'slug' => 'nile-project',
    ]);

    $this->actingAs($this->admin)
        ->get("/admin/projects/{$project->id}/edit")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Projects/Form'));
});

it('binds admin article routes by id only', function () {
    $category = Category::create(['name_ar' => 'تصنيف', 'name_en' => 'Category', 'slug' => 'cat-1']);

    $article = Article::create([
        'category_id' => $category->id,
        'title' => 'Article',
        'title_ar' => 'مقال',
        'title_en' => 'Article',
        'slug' => 'first-article',
        'content' => 'Content',
    ]);

    $this->actingAs($this->admin)
        ->get("/admin/articles/{$article->id}/edit")
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Admin/Articles/Form'));
});

it('binds admin category routes by id only', function () {
    $category = Category::create(['name_ar' => 'تصنيف', 'name_en' => 'Category', 'slug' => 'cat-1']);

    $this->actingAs($this->admin)
        ->put("/admin/categories/{$category->id}", ['name_ar' => 'تصنيف جديد', 'name_en' => 'New Category'])
        ->assertRedirect();

    expect($category->fresh()->name_en)->toBe('New Category');
});
