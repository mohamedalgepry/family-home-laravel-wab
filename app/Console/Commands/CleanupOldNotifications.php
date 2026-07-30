<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupOldNotifications extends Command
{
    protected $signature = 'notifications:cleanup';

    protected $description = 'Delete read notifications older than 30 days';

    public function handle(): int
    {
        $cutoff = now()->subDays(30);

        $deleted = DB::table('notifications')
            ->whereNotNull('read_at')
            ->where('read_at', '<', $cutoff)
            ->delete();

        $this->info("Deleted {$deleted} old read notifications.");

        return Command::SUCCESS;
    }
}
