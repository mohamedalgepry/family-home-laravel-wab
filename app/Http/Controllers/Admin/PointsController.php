<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Services\SettingsService;
use App\Domain\Points\DTOs\AllocatePointsData;
use App\Domain\Points\Models\PointsTransaction;
use App\Domain\Points\Services\PointsService;
use App\Domain\Users\Models\User;
use App\Http\Requests\Admin\AllocatePointsRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PointsController
{
    public function __construct(
        private readonly PointsService $pointsService,
    ) {}

    public function index(): Response
    {
        $user = request()->user();

        abort_unless(in_array($user->role, ['admin', 'manager'], true), 403);

        $filters = request()->only(['manager_id', 'type', 'date_from', 'date_to']);

        $managers = User::where('role', 'manager')
            ->select(['id', 'name', 'points_balance', 'initial_monthly_balance', 'updated_at'])
            ->withCount('units')
            ->orderBy('name')
            ->when($user->isManager(), fn ($q) => $q->where('id', $user->id))
            ->get();

        $query = PointsTransaction::with([
            'manager:id,name',
            'unit:id,name',
        ])->when($user->isManager(), fn ($q) => $q->where('manager_id', $user->id));

        if (! empty($filters['manager_id'])) {
            $query->where('manager_id', $filters['manager_id']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        $ledger = $query->orderByDesc('created_at')->paginate(15);

        if ($user->isManager()) {
            $agentIds = $user->agents()->pluck('id');
            $units = Unit::active()
                ->select('id', 'name')
                ->whereIn('user_id', $agentIds)
                ->orderBy('name')
                ->get();
        } else {
            $units = [];
        }

        $settingsService = app(SettingsService::class);
        $pointsSettings = [
            'daily_deduction_enabled' => in_array($settingsService->get('daily_deduction_enabled', 'false'), ['true', '1', true], true),
            'daily_deduction_value' => (int) $settingsService->get('daily_deduction_value', '10'),
            'monthly_reset_day' => (int) $settingsService->get('monthly_reset_day', '1'),
            'monthly_reset_auto' => in_array($settingsService->get('monthly_reset_auto', 'false'), ['true', '1', true], true),
        ];

        return Inertia::render('Admin/Points/Index', [
            'managers' => $managers,
            'ledger' => $ledger,
            'units' => $units,
            'filters' => $filters,
            'pointsSettings' => $pointsSettings,
        ]);
    }

    public function allocate(AllocatePointsRequest $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->isAdmin() || $user->isManager(), 403);

        $data = AllocatePointsData::from([
            'manager_id' => $request->input('manager_id', $user->id),
            'points' => (int) $request->input('points'),
            'unit_id' => $request->input('unit_id') ? (int) $request->input('unit_id') : null,
            'notes' => $request->input('notes'),
        ]);

        $this->pointsService->allocate($data);

        return redirect()->route('admin.points.index')
            ->with('success', __('points.allocated_successfully'));
    }

    public function monthlyReset(): RedirectResponse
    {
        abort_unless(request()->user()->isAdmin(), 403);

        $this->pointsService->monthlyReset();

        return redirect()->route('admin.points.index')
            ->with('success', __('points.monthly_reset_success'));
    }

    public function dailyDeduct(): RedirectResponse
    {
        abort_unless(request()->user()->isAdmin(), 403);

        $count = $this->pointsService->deductDailyPoints();

        return redirect()->route('admin.points.index')
            ->with('success', __('points.daily_deduct_success', ['count' => $count]));
    }
}
