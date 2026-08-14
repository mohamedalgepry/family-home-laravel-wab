<?php

namespace App\Domain\Listings\Jobs;

use App\Domain\Listings\Models\PageView;
use App\Domain\Listings\Services\PageViewService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RecordPageViewJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 30;

    public function __construct(
        private readonly string $viewableType,
        private readonly int $viewableId,
        private readonly ?string $ip = null,
        private readonly ?string $userAgent = null,
    ) {}

    public function handle(PageViewService $pageViewService): void
    {
        try {
            PageView::create([
                'viewable_type' => $this->viewableType,
                'viewable_id' => $this->viewableId,
                'ip_address' => $this->ip,
                'user_agent' => $this->userAgent,
                'visited_at' => now(),
            ]);

            $pageViewService->incrementCounterCache($this->viewableType, $this->viewableId);
        } catch (\Throwable $e) {
            Log::warning('RecordPageViewJob failed.', [
                'viewable_type' => $this->viewableType,
                'viewable_id' => $this->viewableId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function failed(\Throwable $e): void
    {
        Log::error('RecordPageViewJob exhausted all retries.', [
            'viewable_type' => $this->viewableType,
            'viewable_id' => $this->viewableId,
            'error' => $e->getMessage(),
        ]);
    }
}
