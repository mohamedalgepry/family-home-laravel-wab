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
        $visitsChart = $this->statisticsService->getVisitsChart(30, $user);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'topProjects' => $topProjects,
            'visitsChart' => $visitsChart,
        ]);
    }
}
