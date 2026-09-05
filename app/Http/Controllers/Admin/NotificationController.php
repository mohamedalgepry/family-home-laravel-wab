<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Jobs\RegenerateSitemapJob;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\UnitService;
use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly UnitService $unitService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $this->notificationService->paginated($user),
            'unreadCount' => $user->unreadNotifications()->count(),
            'autoDeleteDays' => (int) Setting::getValue('auto_delete_days', '30'),
        ]);
    }

    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $this->notificationService->markAsRead($request->user(), $id);

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $this->notificationService->markAllAsRead($request->user());

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function approveProject(Request $request, Project $project): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        $project->update(['is_active' => true]);
        dispatch(new RegenerateSitemapJob)->afterCommit();
        $this->clearListingsCache();

        $this->notificationService->markEntityNotificationsAsRead(
            $request->user(),
            'project_id',
            $project->id,
            'new_project_created',
        );

        return redirect()->back()->with('success', __('admin.project_approved', ['name' => $project->name]));
    }

    public function approveUnit(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorize('toggleActive', $unit);

        if ($unit->is_active) {
            return redirect()->back()->with('success', __('common.updated_successfully'));
        }

        $this->unitService->toggleActive($unit->id, $request->user());

        $this->notificationService->markEntityNotificationsAsRead(
            $request->user(),
            'unit_id',
            $unit->id,
            'unit_pending_approval',
        );

        return redirect()->back()->with('success', __('admin.activation_success'));
    }

    public function extendProject(Request $request, Project $project): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        $this->extendListing($request->user(), $project, 'project_id');

        return redirect()->back()->with('success', __('admin.project_extended', [
            'name' => $project->name,
            'days' => $this->extensionDays(),
        ]));
    }

    public function extendUnit(\App\Http\Requests\Admin\ExtendUnitRequest $request, Unit $unit): RedirectResponse
    {
        $days = $request->getResolvedDays();
        $oldAutoDeleteAt = $unit->auto_delete_at;
        $newAutoDeleteAt = null;

        // Concurrency-safe atomic update
        \Illuminate\Support\Facades\DB::transaction(function () use ($unit, $days, &$newAutoDeleteAt) {
            $lockedUnit = Unit::where('id', $unit->id)->lockForUpdate()->firstOrFail();

            // Case 1: Active and not yet expired -> extend from current auto_delete_at
            if ($lockedUnit->is_active && $lockedUnit->auto_delete_at && $lockedUnit->auto_delete_at->isFuture()) {
                $newAutoDeleteAt = $lockedUnit->auto_delete_at->copy()->addDays($days);
            } else {
                // Case 2: Expired or in grace period -> extend from now() and reactivate
                $newAutoDeleteAt = now()->addDays($days);
            }

            $lockedUnit->is_active = true;
            $lockedUnit->auto_delete_at = $newAutoDeleteAt;
            $lockedUnit->save();
        });

        // Audit logging
        \Illuminate\Support\Facades\Log::info('Unit extended by admin', [
            'admin_id' => $request->user()->id,
            'unit_id' => $unit->id,
            'old_auto_delete_at' => $oldAutoDeleteAt?->toIso8601String(),
            'new_auto_delete_at' => $newAutoDeleteAt?->toIso8601String(),
            'extension_days' => $days,
        ]);

        dispatch(new RegenerateSitemapJob)->afterCommit();
        $this->clearListingsCache();

        // Clean up obsolete expiry notifications across all recipients
        $this->notificationService->removeEntityNotifications(
            'unit_id',
            $unit->id,
            [\App\Domain\Listings\Notifications\UnitExpiryNotification::class]
        );
        $this->notificationService->markEntityNotificationsAsRead($request->user(), 'unit_id', $unit->id);

        // Notify unit owner if exists and different from admin
        if ($unit->user && $unit->user_id !== $request->user()->id && $newAutoDeleteAt) {
            $unit->user->notify(new \App\Domain\Listings\Notifications\UnitExtendedNotification(
                unit: $unit,
                days: $days,
                newExpiresAt: $newAutoDeleteAt,
            ));
        }

        $unitName = $unit->name_ar ?: $unit->name;

        return redirect()->back()->with('success', __('admin.unit_extended', [
            'name' => $unitName,
            'days' => $days,
        ]));
    }

    public function deleteUnit(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorize('delete', $unit);

        $unitName = $unit->name_ar ?: $unit->name;

        $this->unitService->deleteUnit($unit->id);

        $this->notificationService->markEntityNotificationsAsRead($request->user(), 'unit_id', $unit->id);

        return redirect()->back()->with('success', __('admin.unit_deleted', ['name' => $unitName]));
    }

    public function dismissNotification(Request $request, string $id): RedirectResponse
    {
        $this->notificationService->dismiss($request->user(), $id);

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function recent(Request $request): JsonResponse
    {
        $request->headers->remove('X-Inertia');
        $request->headers->remove('X-Inertia-Version');

        try {
            $user = $request->user();

            if (! $user) {
                return response()->json(['notifications' => []]);
            }

            return response()->json(['notifications' => $this->notificationService->recent($user)]);
        } catch (\Throwable) {
            return response()->json(['notifications' => []]);
        }
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $request->headers->remove('X-Inertia');
        $request->headers->remove('X-Inertia-Version');

        try {
            $user = $request->user();

            if (! $user) {
                return response()->json(['count' => 0]);
            }

            return response()->json(['count' => $this->notificationService->unreadCount($user)]);
        } catch (\Throwable) {
            return response()->json(['count' => 0]);
        }
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $this->notificationService->delete($request->user(), $id);

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function clearAll(Request $request): RedirectResponse
    {
        $this->notificationService->clearAll($request->user());

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    private function extendListing(User $user, Model $listing, string $entityColumn): void
    {
        $listing->update([
            'is_active' => true,
            'auto_delete_at' => now()->addDays($this->extensionDays()),
        ]);

        dispatch(new RegenerateSitemapJob)->afterCommit();
        $this->clearListingsCache();

        $this->notificationService->markEntityNotificationsAsRead($user, $entityColumn, $listing->id);
    }

    private function extensionDays(): int
    {
        $days = (int) Setting::getValue('auto_delete_days', '30');

        return $days > 0 ? $days : 30;
    }

    private function clearListingsCache(): void
    {
        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable $e) {
            \Log::warning('NotificationController: cache clear failed', ['error' => $e->getMessage()]);
        }
    }
}
