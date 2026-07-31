<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Listings\Services\StatisticsService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function __construct(
        private readonly StatisticsService $statisticsService,
    ) {}

    public function __invoke(): Response
    {
        $user = request()->user();
        $stats = $this->statisticsService->getStats($user);
        $topProjects = $this->statisticsService->getTopProjects(10, $user);
        $topUnits = $this->statisticsService->getTopUnits(10, $user);
        $recentUnits = $this->statisticsService->getRecentUnits(5, $user);
        $recentMessages = $this->statisticsService->getRecentMessages(5, $user);
        $visitsChart = $this->statisticsService->getVisitsChart(30, $user);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'topProjects' => $topProjects,
            'topUnits' => $topUnits,
            'recentUnits' => $recentUnits,
            'recentMessages' => $recentMessages,
            'visitsChart' => $visitsChart,
        ]);
    }
}
