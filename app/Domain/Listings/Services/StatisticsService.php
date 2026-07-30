<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Models\PageView;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;

class StatisticsService
{
    public function getStats(?User $user = null): array
    {
        if ($user && $user->isAgent()) {
            if ($user->manager_id) {
                $teamUserIds = User::where('manager_id', $user->manager_id)
                    ->pluck('id')
                    ->push($user->manager_id);

                return [
                    'total_projects' => Project::whereIn('user_id', $teamUserIds)->orWhereNull('user_id')->count(),
                    'total_units' => Unit::whereIn('user_id', $teamUserIds)->count(),
                    'total_users' => 0,
                    'total_messages' => Message::whereIn('agent_id', $teamUserIds)->count(),
                    'pending_messages' => Message::whereIn('agent_id', $teamUserIds)->where('status', 'pending')->count(),
                ];
            }

            return [
                'total_projects' => Project::where('user_id', $user->id)->orWhereNull('user_id')->count(),
                'total_units' => Unit::where('user_id', $user->id)->count(),
                'total_users' => 0,
                'total_messages' => Message::where('agent_id', $user->id)->count(),
                'pending_messages' => Message::where('agent_id', $user->id)->where('status', 'pending')->count(),
            ];
        }

        if ($user && $user->isManager()) {
            $teamUserIds = $user->agents()->pluck('id')->push($user->id);

            return [
                'total_projects' => Project::whereIn('user_id', $teamUserIds)->orWhereNull('user_id')->count(),
                'total_units' => Unit::whereIn('user_id', $teamUserIds)->count(),
                'total_users' => $user->agents()->count(),
                'total_messages' => Message::whereIn('agent_id', $teamUserIds)->count(),
                'pending_messages' => Message::whereIn('agent_id', $teamUserIds)->where('status', 'pending')->count(),
            ];
        }

        return [
            'total_projects' => Project::count(),
            'total_units' => Unit::count(),
            'total_users' => User::count(),
            'total_messages' => Message::count(),
            'pending_messages' => Message::where('status', 'pending')->count(),
        ];
    }

    public function getTopProjects(int $limit = 10, ?User $user = null): Collection
    {
        $query = Project::active()->with('area');

        if ($user && ! $user->isAdmin()) {
            if ($user->isManager()) {
                $teamUserIds = $user->agents()->pluck('id')->push($user->id);
                $query->where(function ($q) use ($teamUserIds) {
                    $q->whereIn('user_id', $teamUserIds)->orWhereNull('user_id');
                });
            } elseif ($user->isAgent()) {
                if ($user->manager_id) {
                    $teamUserIds = User::where('manager_id', $user->manager_id)
                        ->pluck('id')
                        ->push($user->manager_id);
                    $query->where(function ($q) use ($teamUserIds) {
                        $q->whereIn('user_id', $teamUserIds)->orWhereNull('user_id');
                    });
                } else {
                    $query->where(function ($q) use ($user) {
                        $q->where('user_id', $user->id)->orWhereNull('user_id');
                    });
                }
            }
        }

        return $query->orderByDesc('views_count')
            ->limit($limit)
            ->get(['id', 'name', 'slug', 'views_count', 'area_id']);
    }

    public function getVisitsChart(int $days = 30, ?User $user = null): array
    {
        $results = PageView::where('visited_at', '>=', now()->subDays($days))
            ->selectRaw('DATE(visited_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $chart = [];
        $end = now()->endOfDay();
        $start = now()->subDays($days)->startOfDay();

        $data = $results->keyBy('date');

        for ($date = $start->copy(); $date <= $end; $date->addDay()) {
            $key = $date->format('Y-m-d');
            $chart[] = [
                'date' => $key,
                'count' => (int) ($data[$key]->count ?? 0),
            ];
        }

        return $chart;
    }
}
