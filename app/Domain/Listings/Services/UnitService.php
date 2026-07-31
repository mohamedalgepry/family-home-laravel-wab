<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Actions\CreateUnitAction;
use App\Domain\Listings\Actions\DeleteUnitAction;
use App\Domain\Listings\Actions\UpdateUnitAction;
use App\Domain\Listings\DTOs\CreateUnitData;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Notifications\UnitApprovedNotification;
use App\Domain\Listings\Notifications\UnitPendingApprovalNotification;
use App\Domain\Media\Jobs\GenerateThumbnailsJob;
use App\Domain\Users\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UnitService
{
    public function __construct(
        private readonly CreateUnitAction $createUnitAction,
        private readonly UpdateUnitAction $updateUnitAction,
        private readonly DeleteUnitAction $deleteUnitAction,
        private readonly SitemapService $sitemapService,
    ) {}

    public function getPaginatedUnits(array $filters = [], ?User $user = null): LengthAwarePaginator
    {
        $query = Unit::with(['type', 'area', 'project', 'images']);

        if ($user !== null && ! $user->isAdmin()) {
            if ($user->isManager()) {
                $agentIds = $user->agents()->pluck('id')->push($user->id);
                $query->whereIn('user_id', $agentIds);
            } elseif ($user->isAgent()) {
                if ($user->manager_id) {
                    $teamUserIds = User::where('manager_id', $user->manager_id)
                        ->pluck('id')
                        ->push($user->manager_id);
                    $query->whereIn('user_id', $teamUserIds);
                } else {
                    $query->where('user_id', $user->id);
                }
            }
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                    ->orWhere('name_ar', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('slug_ar', 'like', "%{$search}%")
                    ->orWhere('slug_en', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['area_id'])) {
            $query->where('area_id', $filters['area_id']);
        }

        if (! empty($filters['type_id'])) {
            $query->where('type_id', $filters['type_id']);
        }

        if (! empty($filters['transaction'])) {
            $query->where('transaction', $filters['transaction']);
        }

        $sortField = $filters['sort'] ?? null;
        $sortDir = $filters['direction'] ?? 'desc';
        $allowedSorts = ['created_at', 'name', 'price', 'area_sqm', 'priority_points'];

        if ($sortField && in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderByDesc('priority_points')->orderByDesc('is_pinned')->orderByDesc('created_at');
        }

        $perPage = min((int) ($filters['per_page'] ?? 15), 50);

        return $query->paginate($perPage);
    }

    public function createUnit(CreateUnitData $data, User $user, array $imagePaths = [], int $primaryImageIndex = 0): Unit
    {
        $unit = DB::transaction(function () use ($data, $user, $imagePaths, $primaryImageIndex) {
            $unit = $this->createUnitAction->execute($data, $user);

            if (! empty($imagePaths)) {
                $this->persistImagePaths($unit, $imagePaths, $primaryImageIndex);
            }

            $this->clearListingsCache();

            return $unit->load(['type', 'area', 'images']);
        });

        $this->notifyPendingApproval($unit, $user);

        // إضافة الوحدة فوراً لـ Sitemap
        $this->regenerateSitemap();

        return $unit;
    }

    private function notifyPendingApproval(Unit $unit, User $user): void
    {
        if (!$user->isAgent()) {
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
                $this->persistImagePaths($unit, $newImagePaths, $primaryImageIndex);
            }

            $this->clearListingsCache();

            return $unit->load(['type', 'area', 'images']);
        });

        $this->regenerateSitemap();

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
        foreach ($imagePaths as $path) {
            Storage::disk('public')->delete($path);
            $this->deleteThumbnail($path);
        }

        // إعادة توليد ملف sitemap.xml فوراً
        $this->regenerateSitemap();
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

        $this->regenerateSitemap();

        if (!$wasActive && $unit->is_active) {
            $this->notifyApproved($unit, $approver);
        }

        return $unit;
    }

    private function notifyApproved(Unit $unit, ?User $approver = null): void
    {
        $owner = $unit->user;

        if (!$owner || !$owner->isAgent()) {
            return;
        }

        $owner->notify(new UnitApprovedNotification($unit, $approver ?? $owner));
        Cache::forget("user_{$owner->id}_unread_count");
    }

    private function clearListingsCache(): void
    {
        Cache::increment('listing_cache_version');
    }

    /**
     * حذف ملف الـ Thumbnail المرتبط بمسار صورة.
     * يبحث عن thumb_{filename} في نفس المجلد ويحذفه.
     */
    private function deleteThumbnail(string $path): void
    {
        if (! $path) {
            return;
        }
        $dir = dirname($path);
        $filename = basename($path);
        $thumbPath = ($dir !== '.' ? $dir . '/' : '') . 'thumb_' . $filename;
        Storage::disk('public')->delete($thumbPath);
    }

    /**
     * إعادة توليد sitemap.xml فوراً في الخلفية.
     */
    private function regenerateSitemap(): void
    {
        try {
            $this->sitemapService->regenerate();
        } catch (\Throwable $e) {
            // عدم السماح لخطأ الـ sitemap بإيقاف باقي العملية
        }
    }

    public function removeImage(int $unitId, int $imageId): void
    {
        $unit = Unit::findOrFail($unitId);
        $image = $unit->images()->findOrFail($imageId);

        $path = $image->path;
        $wasPrimary = $image->is_primary;

        $image->delete();
        // حذف الصورة الأصلية والـ Thumbnail معاً
        Storage::disk('public')->delete($path);
        $this->deleteThumbnail($path);

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

    private function persistImagePaths(Unit $unit, array $paths, int $primaryIndex = 0): void
    {
        $existingCount = $unit->images()->count();
        $hasPrimary = $unit->images()->where('is_primary', true)->exists();

        foreach ($paths as $i => $path) {
            $isPrimary = ! $hasPrimary && $i === $primaryIndex;
            if ($isPrimary) {
                $hasPrimary = true;
            }
            $unit->images()->create([
                'path' => $path,
                'sort_order' => $existingCount + $i + 1,
                'is_primary' => $isPrimary,
            ]);
        }

        dispatch(new GenerateThumbnailsJob(
            modelType: Unit::class,
            modelId: $unit->id,
            paths: $paths,
        ))->afterCommit();
    }
}
