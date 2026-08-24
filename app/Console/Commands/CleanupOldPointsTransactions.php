<?php

namespace App\Console\Commands;

use App\Domain\Points\Models\PointsTransaction;
use Illuminate\Console\Command;

class CleanupOldPointsTransactions extends Command
{
    protected $signature = 'points:cleanup {--days=180 : The retention period in days for daily deduction records}';

    protected $description = 'Delete daily deduction points transactions older than specified days (default 180 days / 6 months)';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        if ($days <= 0) {
            $days = 180;
        }

        $cutoff = now()->subDays($days);

        $deleted = PointsTransaction::where('type', 'daily_deduct')
            ->where('created_at', '<', $cutoff)
            ->delete();

        $this->info("Deleted {$deleted} daily deduction transactions older than {$days} days.");

        return Command::SUCCESS;
    }
}
