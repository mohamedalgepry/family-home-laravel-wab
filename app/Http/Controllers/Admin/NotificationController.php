<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\UnitService;
use App\Domain\Listings\Actions\ApprovePendingProjectAction;
use App\Domain\Listings\Actions\ApprovePendingUnitAction;
use App\Domain\Listings\Actions\ExtendProjectListingAction;
use App\Domain\Listings\Actions\ExtendUnitListingAction;
use App\Domain\Users\Services\NotificationService;
use App\Http\Controllers\Controller;
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
            'unreadCount' => $this->notificationService->unreadCount($user),
            'autoDeleteDays' => (int) Setting::getValue('auto_delete_days', '30'),
        ]);
    }

    public function markAsRead(Request $request, string $id): RedirectResponse|JsonResponse
    {
        $this->notificationService->markAsRead($request->user(), $id);

        if (! $request->header('X-Inertia') && ($request->expectsJson() || $request->ajax())) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $this->notificationService->markAllAsRead($request->user());

        return redirect()->back()->with('success', __('common.updated_successfully'));
    }

    public function approveProject(Request $request, Project $project, ApprovePendingProjectAction $approveAction): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        $approveAction->execute($project, $request->user());

        return $this->redirectAfterNotificationAction(
            $request,
            __('admin.project_approved', ['name' => $project->name]),
        );
    }

    public function approveUnit(Request $request, Unit $unit, ApprovePendingUnitAction $approveAction): RedirectResponse
    {
        $this->authorize('toggleActive', $unit);

        $activated = $approveAction->execute($unit, $request->user());

        return $this->redirectAfterNotificationAction(
            $request,
            $activated ? __('admin.activation_success') : __('common.updated_successfully'),
        );
    }

    public function extendProject(Request $request, Project $project, ExtendProjectListingAction $extendAction): RedirectResponse
    {
        abort_unless($request->user()->isAdmin(), 403);

        $days = $extendAction->execute($project, $request->user());

        return $this->redirectAfterNotificationAction(
            $request,
            __('admin.project_extended', [
                'name' => $project->name,
                'days' => $days,
            ]),
        );
    }

    public function extendUnit(\App\Http\Requests\Admin\ExtendUnitRequest $request, Unit $unit, ExtendUnitListingAction $extendAction): RedirectResponse|JsonResponse
    {
        $days = $request->getResolvedDays();

        $extendAction->execute($unit, $days, $request->user());

        $unitName = $unit->name_ar ?: $unit->name;

        return $this->redirectAfterNotificationAction($request, __('admin.unit_extended', [
            'name' => $unitName,
            'days' => $days,
        ]));
    }

    public function deleteUnit(Request $request, Unit $unit): RedirectResponse
    {
        $this->authorize('delete', $unit);

        $unitName = $unit->name_ar ?: $unit->name;
        $this->unitService->deleteUnit($unit->id);
        $this->notificationService->markEntityNotificationsAsReadForAll('unit_id', $unit->id);

        return $this->redirectAfterNotificationAction(
            $request,
            __('admin.unit_deleted', ['name' => $unitName]),
        );
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
            if (! $user) return response()->json(['notifications' => []]);
            return response()->json(['notifications' => $this->notificationService->recent($user)]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to fetch recent notifications: ' . $e->getMessage(), ['user_id' => $request->user()?->id]);
            return response()->json(['notifications' => []]);
        }
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $request->headers->remove('X-Inertia');
        $request->headers->remove('X-Inertia-Version');

        try {
            $user = $request->user();
            if (! $user) return response()->json(['count' => 0]);
            return response()->json(['count' => $this->notificationService->unreadCount($user)]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Failed to fetch unread notification count: ' . $e->getMessage(), ['user_id' => $request->user()?->id]);
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




    private function redirectAfterNotificationAction(Request $request, string $message): RedirectResponse
    {
        if ($request->header('X-Inertia')) {
            return redirect()->route('admin.notifications.index')->with('success', $message);
        }
        return redirect()->back()->with('success', $message);
    }
}
