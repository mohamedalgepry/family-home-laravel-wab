<?php

namespace App\Domain\Points\Jobs;

use App\Domain\Points\Services\PointsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MonthlyResetJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 60;

    public array $backoff = [30, 60, 120];

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
