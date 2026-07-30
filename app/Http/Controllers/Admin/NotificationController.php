<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\ListingService;
use App\Domain\Listings\Services\UnitService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = Cache::remember("user_{$user->id}_notifications_page", 60, function () use ($user) {
            return $user->notifications()
                ->paginate(20)
                ->through(function ($notification) {
                    $data = $notification->data;
                    $data['id'] = $notification->id;
                    $data['read_at'] = $notification->read_at?->toIso8601String();
                    $data['created_at_human'] = $notification->created_at->diffForHumans();

                    return $data;
                });
        });

        $unreadCount = $user->unreadNotifications()->count();

        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();
        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification && ! $notification->read_at) {
            $notification->markAsRead();
            Cache::forget("user_{$user->id}_unread_count");
            Cache::forget("user_{$user->id}_notifications_page");
        }

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->unreadNotifications->markAsRead();
        Cache::forget("user_{$user->id}_unread_count");
        Cache::forget("user_{$user->id}_notifications_page");

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function approveProject(Request $request, Project $project): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        $project->update(['is_active' => true]);

        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable) {
        }

        $user = $request->user();
        $notification = $user->unreadNotifications()
            ->get()
            ->first(fn ($n) => ($n->data['project_id'] ?? null) == $project->id
                && ($n->data['type'] ?? '') === 'new_project_created');

        if ($notification) {
            $notification->markAsRead();
            Cache::forget("user_{$user->id}_unread_count");
        }

        return redirect()->back()->with('success', "تم موافقة وتفعيل المشروع \"{$project->name}\" بنجاح!");
    }

    public function approveUnit(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorize('toggleActive', $unit);

        if ($unit->is_active) {
            return redirect()->back()->with('success', __('common.updated_successfully'));
        }

        app(UnitService::class)->toggleActive($unit->id, $request->user());

        $user = $request->user();
        $notification = $user->unreadNotifications()
            ->get()
            ->first(fn ($item) => ($item->data['unit_id'] ?? null) == $unit->id
                && ($item->data['type'] ?? '') === 'unit_pending_approval');

        if ($notification) {
            $notification->markAsRead();
        }

        Cache::forget("user_{$user->id}_unread_count");
        Cache::forget("user_{$user->id}_notifications_page");

        return redirect()->back()->with('success', __('admin.activation_success'));
    }

    public function extendProject(Request $request, Project $project): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isAdmin(), 403);

        $days = (int) Setting::getValue('auto_delete_days', '30');
        $newExpiry = now()->addDays($days > 0 ? $days : 30);

        $project->update([
            'is_active' => true,
            'auto_delete_at' => $newExpiry,
        ]);

        // Clear cached listings
        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable) {
        }

        // Mark all associated notifications for this project as read
        $notifications = $user->unreadNotifications()
            ->get()
            ->filter(fn ($n) => ($n->data['project_id'] ?? null) == $project->id);

        foreach ($notifications as $n) {
            $n->markAsRead();
        }
        Cache::forget("user_{$user->id}_unread_count");

        return redirect()->back()->with('success', "تم تمديد مدة مشروع \"{$project->name}\" بنجاح لمدة 30 يوماً إضافية!");
    }

    public function extendUnit(Request $request, Unit $unit): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isAdmin(), 403);

        $days = (int) Setting::getValue('auto_delete_days', '30');
        $newExpiry = now()->addDays($days > 0 ? $days : 30);

        $unit->update([
            'is_active' => true,
            'auto_delete_at' => $newExpiry,
        ]);

        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable) {
        }

        $notifications = $user->unreadNotifications()
            ->get()
            ->filter(fn ($n) => ($n->data['unit_id'] ?? null) == $unit->id);

        foreach ($notifications as $n) {
            $n->markAsRead();
        }
        Cache::forget("user_{$user->id}_unread_count");

        $unitName = $unit->name_ar ?: $unit->name;

        return redirect()->back()->with('success', "تم تمديد مدة الوحدة \"{$unitName}\" بنجاح لمدة {$days} يوماً!");
    }

    public function deleteUnit(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorize('delete', $unit);

        $user = $request->user();

        $unitName = $unit->name_ar ?: $unit->name;

        $unit->images()->delete();
        $unit->messages()->delete();
        $unit->features()->detach();
        $unit->pointsTransactions()->delete();
        $unit->delete();

        try {
            app(ListingService::class)->clearCache();
        } catch (\Throwable) {
        }

        $notifications = $user->unreadNotifications()
            ->get()
            ->filter(fn ($n) => ($n->data['unit_id'] ?? null) == $unit->id);

        foreach ($notifications as $n) {
            $n->markAsRead();
        }
        Cache::forget("user_{$user->id}_unread_count");

        return redirect()->back()->with('success', "تم حذف الوحدة \"{$unitName}\" نهائياً!");
    }

    public function dismissNotification(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();
        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
            Cache::forget("user_{$user->id}_unread_count");
            Cache::forget("user_{$user->id}_notifications_page");
        }

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function recent(Request $request): JsonResponse
    {
        $user = $request->user();
        $notifications = $user->notifications()
            ->take(5)
            ->get()
            ->map(function ($notification) {
                $data = $notification->data;
                $data['id'] = $notification->id;
                $data['read_at'] = $notification->read_at?->toIso8601String();
                $data['created_at_human'] = $notification->created_at->diffForHumans();

                return $data;
            });

        return response()->json(['notifications' => $notifications]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();
        $count = $user?->unreadNotifications()->count() ?? 0;

        return response()->json(['count' => $count]);
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $user = $request->user();
        $deleted = $user->notifications()->where('id', $id)->delete();

        if ($deleted) {
            Cache::forget("user_{$user->id}_unread_count");
            Cache::forget("user_{$user->id}_notifications_page");
        }

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function clearAll(Request $request): RedirectResponse
    {
        $user = $request->user();
        $user->notifications()->delete();

        Cache::forget("user_{$user->id}_unread_count");
        Cache::forget("user_{$user->id}_notifications_page");

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }
}
