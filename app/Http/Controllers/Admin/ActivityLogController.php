<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        $this->authorize('view-activity-log');

        $filters = request()->only(['event', 'log_name', 'search']);

        $query = Activity::with(['causer' => function ($q) {
            $q->select('id', 'name');
        }]);

        if (! empty($filters['event'])) {
            $query->where('event', $filters['event']);
        }

        if (! empty($filters['log_name'])) {
            $query->where('log_name', $filters['log_name']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('causer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $activities = $query->orderByDesc('created_at')->paginate(20);

        return Inertia::render('Admin/ActivityLog/Index', [
            'activities' => $activities,
            'filters' => $filters,
        ]);
    }
}
