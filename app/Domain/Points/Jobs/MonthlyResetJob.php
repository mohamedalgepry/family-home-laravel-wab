<?php

namespace App\Domain\Points\Jobs;

use App\Domain\Points\Services\PointsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class MonthlyResetJob implements ShouldQueue
{
    use Queueable;

    public function __construct() {}

    public function handle(PointsService $pointsService): void
    {
        try {
            $processed = $pointsService->monthlyReset();

            Log::info('MonthlyResetJob completed.', [
                'managers_reset' => $processed,
            ]);
        } catch (\Throwable $e) {
            Log::critical('MonthlyResetJob failed entirely.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $e): void
    {
        Log::critical('MonthlyResetJob exhausted all retries.', [
            'error' => $e->getMessage(),
        ]);
    }
}
