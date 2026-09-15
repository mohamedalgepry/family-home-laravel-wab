<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Models\PageView;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class StatisticsService
{
    public function getStats(?User $user = null): array
    {
        $cacheKey = 'dashboard_stats_'.($user?->id ?? 'guest');

        return Cache::remember($cacheKey, 300, function () use ($user) {
            if ($user && $user->isAgent()) {
                $teamUserIds = $user->manager_id
                    ? User::where('manager_id', $user->manager_id)->pluck('id')->push($user->manager_id)
                    : collect([$user->id]);

                $unitStats = Unit::whereIn('user_id', $teamUserIds)
                    ->selectRaw("
                        COUNT(*) as total_units,
                        COUNT(CASE WHEN transaction = 'sale' THEN 1 END) as sale_units,
                        COUNT(CASE WHEN transaction = 'rent' THEN 1 END) as rent_units,
                        COALESCE(SUM(views_count), 0) as total_views
                    ")
                    ->first();

                $msgStats = Message::whereIn('agent_id', $teamUserIds)
                    ->selectRaw("
                        COUNT(*) as total_messages,
                        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_messages
                    ")
                    ->first();

                return [
                    'total_projects' => Project::whereIn('user_id', $teamUserIds)->orWhereNull('user_id')->count(),
                    'total_units' => (int) ($unitStats?->total_units ?? 0),
                    'sale_units' => (int) ($unitStats?->sale_units ?? 0),
                    'rent_units' => (int) ($unitStats?->rent_units ?? 0),
                    'total_users' => 0,
                    'total_messages' => (int) ($msgStats?->total_messages ?? 0),
                    'pending_messages' => (int) ($msgStats?->pending_messages ?? 0),
                    'total_views' => (int) ($unitStats?->total_views ?? 0),
                ];
            }

            if ($user && $user->isManager()) {
                $teamUserIds = $user->agents()->pluck('id')->push($user->id);

                $unitStats = Unit::whereIn('user_id', $teamUserIds)
                    ->selectRaw("
                        COUNT(*) as total_units,
                        COUNT(CASE WHEN transaction = 'sale' THEN 1 END) as sale_units,
                        COUNT(CASE WHEN transaction = 'rent' THEN 1 END) as rent_units,
                        COALESCE(SUM(views_count), 0) as total_views
                    ")
                    ->first();

                $msgStats = Message::whereIn('agent_id', $teamUserIds)
                    ->selectRaw("
                        COUNT(*) as total_messages,
                        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_messages
                    ")
                    ->first();

                return [
                    'total_projects' => Project::whereIn('user_id', $teamUserIds)->orWhereNull('user_id')->count(),
                    'total_units' => (int) ($unitStats?->total_units ?? 0),
                    'sale_units' => (int) ($unitStats?->sale_units ?? 0),
                    'rent_units' => (int) ($unitStats?->rent_units ?? 0),
                    'total_users' => $user->agents()->count(),
                    'total_messages' => (int) ($msgStats?->total_messages ?? 0),
                    'pending_messages' => (int) ($msgStats?->pending_messages ?? 0),
                    'total_views' => (int) ($unitStats?->total_views ?? 0),
                ];
            }

            $unitStats = Unit::query()
                ->selectRaw("
                    COUNT(*) as total_units,
                    COUNT(CASE WHEN transaction = 'sale' THEN 1 END) as sale_units,
                    COUNT(CASE WHEN transaction = 'rent' THEN 1 END) as rent_units,
                    COALESCE(SUM(views_count), 0) as total_views
                ")
                ->first();

            $msgStats = Message::query()
                ->selectRaw("
                    COUNT(*) as total_messages,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_messages
                ")
                ->first();

            $projStats = Project::query()
                ->selectRaw("
                    COUNT(*) as total_projects,
                    COALESCE(SUM(views_count), 0) as total_views
                ")
                ->first();

            return [
                'total_projects' => (int) ($projStats?->total_projects ?? 0),
                'total_units' => (int) ($unitStats?->total_units ?? 0),
                'sale_units' => (int) ($unitStats?->sale_units ?? 0),
                'rent_units' => (int) ($unitStats?->rent_units ?? 0),
                'total_users' => User::count(),
                'total_messages' => (int) ($msgStats?->total_messages ?? 0),
                'pending_messages' => (int) ($msgStats?->pending_messages ?? 0),
                'total_views' => (int) (($unitStats?->total_views ?? 0) + ($projStats?->total_views ?? 0)),
            ];
        });
    }

    public function getTopProjects(int $limit = 10, ?User $user = null): Collection
    {
        $cacheKey = 'dashboard_top_projects_'.$limit.'_'.($user?->id ?? 'guest');

        return Cache::remember($cacheKey, 300, function () use ($limit, $user) {
            $query = Project::active()->with('area');

            if ($user && ! $user->isAdmin()) {
                $teamUserIds = $user->isManager()
                    ? $user->agents()->pluck('id')->push($user->id)
                    : ($user->manager_id ? User::where('manager_id', $user->manager_id)->pluck('id')->push($user->manager_id) : collect([$user->id]));

                $query->where(function ($q) use ($teamUserIds) {
                    $q->whereIn('user_id', $teamUserIds)->orWhereNull('user_id');
                });
            }

            return $query->orderByDesc('views_count')
                ->limit($limit)
                ->get(['id', 'name', 'name_ar', 'name_en', 'slug', 'views_count', 'area_id']);
        });
    }

    public function getRecentUnits(int $limit = 5, ?User $user = null): Collection
    {
        $cacheKey = 'dashboard_recent_units_'.$limit.'_'.($user?->id ?? 'guest');

        return Cache::remember($cacheKey, 300, function () use ($limit, $user) {
            $query = Unit::with(['type', 'area']);

            if ($user && ! $user->isAdmin()) {
                $teamUserIds = $user->isManager()
                    ? $user->agents()->pluck('id')->push($user->id)
                    : ($user->manager_id ? User::where('manager_id', $user->manager_id)->pluck('id')->push($user->manager_id) : collect([$user->id]));

                $query->whereIn('user_id', $teamUserIds);
            }

            return $query->latest()
                ->limit($limit)
                ->get();
        });
    }

    public function getRecentMessages(int $limit = 5, ?User $user = null): Collection
    {
        $cacheKey = 'dashboard_recent_messages_'.$limit.'_'.($user?->id ?? 'guest');

        return Cache::remember($cacheKey, 300, function () use ($limit, $user) {
            $query = Message::with('unit:id,name_ar,name_en,slug');

            if ($user && ! $user->isAdmin()) {
                $teamUserIds = $user->isManager()
                    ? $user->agents()->pluck('id')->push($user->id)
                    : ($user->manager_id ? User::where('manager_id', $user->manager_id)->pluck('id')->push($user->manager_id) : collect([$user->id]));

                $query->whereIn('agent_id', $teamUserIds);
            }

            return $query->latest()
                ->limit($limit)
                ->get();
        });
    }

    public function getTopUnits(int $limit = 10, ?User $user = null): Collection
    {
        $cacheKey = 'dashboard_top_units_'.$limit.'_'.($user?->id ?? 'guest');

        return Cache::remember($cacheKey, 300, function () use ($limit, $user) {
            $query = Unit::active()->with(['area', 'type']);

            if ($user && ! $user->isAdmin()) {
                $teamUserIds = $user->isManager()
                    ? $user->agents()->pluck('id')->push($user->id)
                    : ($user->manager_id ? User::where('manager_id', $user->manager_id)->pluck('id')->push($user->manager_id) : collect([$user->id]));

                $query->whereIn('user_id', $teamUserIds);
            }

            return $query->orderByDesc('views_count')
                ->limit($limit)
                ->get();
        });
    }

    public function getVisitsChart(int $days = 30, ?User $user = null): array
    {
        $cacheKey = 'dashboard_visits_chart_'.$days.'_'.($user?->id ?? 'guest');

        return Cache::remember($cacheKey, 300, function () use ($days) {
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
        });
    }
}
