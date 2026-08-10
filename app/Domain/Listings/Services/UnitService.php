<?php

namespace App\Domain\Listings\Services;

use App\Domain\Common\QueryBuilders\ListingQueryBuilder;
use App\Domain\Common\QueryBuilders\UserScopeQueryBuilder;
use App\Domain\Listings\Actions\CreateUnitAction;
use App\Domain\Listings\Actions\DeleteUnitAction;
use App\Domain\Listings\Actions\UpdateUnitAction;
use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\UnitApprovedNotification;
use App\Domain\Listings\Notifications\UnitPendingApprovalNotification;
use App\Domain\Users\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class UnitService
{
    public function __construct(
        private readonly CreateUnitAction $createUnitAction,
        private readonly UpdateUnitAction $updateUnitAction,
        private readonly DeleteUnitAction $deleteUnitAction,
        private readonly ListingImageService $listingImageService,
    ) {}

    public function getPaginatedUnits(array $filters = [], ?User $user = null): LengthAwarePaginator
    {
        $query = Unit::with(['type', 'area', 'project', 'images']);

        UserScopeQueryBuilder::applyListingsScope($query, $user);
        ListingQueryBuilder::applySearch($query, $filters, ['name_en', 'name_ar', 'slug', 'slug_ar', 'slug_en']);
        ListingQueryBuilder::applyExactMatches($query, $filters, ['area_id', 'type_id', 'transaction']);

        if (! ListingQueryBuilder::applySort($query, $filters, ['created_at', 'name', 'price', 'area_sqm', 'priority_points'])) {
            $query->orderByDesc('priority_points')->orderByDesc('is_pinned')->orderByDesc('created_at');
        }

        return $query->paginate(ListingQueryBuilder::perPage($filters));
    }

    public function createUnit(CreateUnitData $data, User $user, array $imagePaths = [], int $primaryImageIndex = 0): Unit
    {
        $unit = DB::transaction(function () use ($data, $user, $imagePaths, $primaryImageIndex) {
            $unit = $this->createUnitAction->execute($data, $user);

            if (! empty($imagePaths)) {
                $this->listingImageService->persistImages($unit, $imagePaths, primaryIndex: $primaryImageIndex);
            }

            $this->clearListingsCache();

            return $unit->load(['type', 'area', 'images']);
        });

        $this->notifyPendingApproval($unit, $user);

        // إضافة الوحدة فوراً لـ Sitemap

        return $unit;
    }

    private function notifyPendingApproval(Unit $unit, User $user): void
    {
        if (! $user->isAgent()) {
            return;
        }

        $manager = $user->manager;

        if ($manager) {
            $manager->notify(new UnitPendingApprovalNotification($unit, $user));
            Cache::forget("user_{$manager->id}_unread_count");
        } else {
            $admins = User::where('role', 'admin')->get(['id']);
            foreach ($admins as $admin) {
                $admin->notify(new UnitPendingApprovalNotification($unit, $user));
                Cache::forget("user_{$admin->id}_unread_count");
            }
        }
    }

    public function updateUnit(int $unitId, CreateUnitData $data, User $user, array $newImagePaths = [], int $primaryImageIndex = 0): Unit
    {
        $unit = DB::transaction(function () use ($unitId, $data, $user, $newImagePaths, $primaryImageIndex) {
            $unit = $this->updateUnitAction->execute($unitId, $data, $user);

            if (! empty($newImagePaths)) {
                $this->listingImageService->persistImages($unit, $newImagePaths, primaryIndex: $primaryImageIndex);
            }

            $this->clearListingsCache();

            return $unit->load(['type', 'area', 'images']);
        });


        return $unit;
    }

    public function deleteUnit(int $unitId): void
    {
        $unit = Unit::with('images')->findOrFail($unitId);

        $imagePaths = $unit->images->pluck('path')->toArray();

        DB::transaction(function () use ($unit, $unitId) {
            $unit->images()->delete();
            $this->deleteUnitAction->execute($unitId);
            $this->clearListingsCache();
        });

        // حذف الصور الأصلية والـ Thumbnails من الـ Storage
        $this->listingImageService->deleteImageFiles($imagePaths);

        // إعادة توليد ملف sitemap.xml فوراً
    }

    public function togglePin(int $unitId): Unit
    {
        $unit = Unit::findOrFail($unitId);
        $unit->update(['is_pinned' => ! $unit->is_pinned]);

        $this->clearListingsCache();

        return $unit->fresh();
    }

    public function toggleDeal(int $unitId): Unit
    {
        $unit = Unit::findOrFail($unitId);
        $unit->update(['is_deal' => ! $unit->is_deal]);

        $this->clearListingsCache();

        return $unit->fresh();
    }

    public function toggleActive(int $unitId, ?User $approver = null): Unit
    {
        $unit = Unit::findOrFail($unitId);
        $wasActive = $unit->is_active;
        $unit->update(['is_active' => ! $wasActive]);

        $this->clearListingsCache();

        $unit = $unit->fresh();

        $this->sitemapService->regenerate();

        if (! $wasActive && $unit->is_active) {
            $this->notifyApproved($unit, $approver);
        }

        return $unit;
    }

    private function notifyApproved(Unit $unit, ?User $approver = null): void
    {
        $owner = $unit->user;

        if (! $owner || ! $owner->isAgent()) {
            return;
        }

        $owner->notify(new UnitApprovedNotification($unit, $approver ?? $owner));
        Cache::forget("user_{$owner->id}_unread_count");
    }

    private function clearListingsCache(): void
    {
        Cache::increment(ListingService::CACHE_VERSION_KEY);
    }

    public function removeImage(int $unitId, int $imageId): void
    {
        $unit = Unit::findOrFail($unitId);
        $image = $unit->images()->findOrFail($imageId);

        $path = $image->path;
        $wasPrimary = $image->is_primary;

        $image->delete();
        // حذف الصورة الأصلية والـ Thumbnail معاً
        $this->listingImageService->deleteImageFiles([$path]);

        // إذا كانت الصورة المحذوفة هي الرئيسية، اجعل أول صورة متبقية هي الرئيسية
        if ($wasPrimary) {
            $first = $unit->images()->orderBy('sort_order')->first();
            if ($first) {
                $first->update(['is_primary' => true]);
            }
        }
    }

    public function setPrimaryImage(int $unitId, int $imageId): void
    {
        $unit = Unit::findOrFail($unitId);

        // إلغاء الرئيسية من كل الصور
        $unit->images()->update(['is_primary' => false]);

        // تعيين الصورة الجديدة كرئيسية
        $unit->images()->where('id', $imageId)->update(['is_primary' => true]);
    }
}
