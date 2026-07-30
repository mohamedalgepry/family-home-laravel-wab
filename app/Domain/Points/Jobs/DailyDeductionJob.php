<?php

namespace App\Domain\Points\Jobs;

use App\Domain\Points\Services\PointsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class DailyDeductionJob implements ShouldQueue
{
    use Queueable;

    public function __construct() {}

    public function handle(PointsService $pointsService): void
    {
        $lockKey = 'daily_deduction_' . now()->format('Y-m-d');
        if (! Cache::add($lockKey, true, now()->endOfDay())) {
            Log::info('DailyDeductionJob already ran today, skipping.');
            return;
        }

        try {
            $processed = $pointsService->deductDailyPoints();

            Log::info('DailyDeductionJob completed.', [
                'units_processed' => $processed,
            ]);
        } catch (\Throwable $e) {
            Log::critical('DailyDeductionJob failed entirely.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $e): void
    {
        Log::critical('DailyDeductionJob exhausted all retries.', [
            'error' => $e->getMessage(),
        ]);
    }
}
