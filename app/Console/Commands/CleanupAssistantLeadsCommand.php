<?php

namespace App\Console\Commands;

use App\Domain\Assistant\Models\AssistantLead;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CleanupAssistantLeadsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leads:cleanup {--days=90 : Retain records newer than this number of days}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prune old assistant leads records older than the specified retention period';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        if ($days < 0) {
            $this->error('The --days option must be a non-negative integer.');
            return 1;
        }

        $cutoff = Carbon::now()->subDays($days);
        $query = AssistantLead::where('created_at', '<', $cutoff);

        $count = $query->count();

        if ($count === 0) {
            $this->info("No assistant leads found older than {$days} days.");
            return 0;
        }

        $this->info("Found {$count} assistant lead(s) older than {$days} days (cutoff: {$cutoff->toDateTimeString()}). Deleting...");

        $deleted = $query->delete();

        $this->info("Successfully deleted {$deleted} assistant lead record(s).");

        return 0;
    }
}
