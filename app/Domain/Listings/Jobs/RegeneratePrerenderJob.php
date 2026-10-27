<?php

namespace App\Domain\Listings\Jobs;

use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

class RegeneratePrerenderJob implements ShouldQueue, ShouldBeUnique
{
    use Queueable;

    public int $tries = 2;

    public int $timeout = 55;

    public int $uniqueFor = 300;

    public function uniqueId(): string
    {
        return 'public-prerender-pages';
    }

    public function handle(): void
    {
        $script = base_path('scripts/prerender.js');
        if (! is_file($script)) {
            throw new \RuntimeException('Prerender script is missing.');
        }

        $process = new Process(['node', $script], base_path(), null, null, 50);
        $process->run();

        if (! $process->isSuccessful()) {
            Log::error('Prerender regeneration failed.', [
                'exit_code' => $process->getExitCode(),
                'error_output' => mb_substr($process->getErrorOutput(), 0, 4000),
            ]);

            throw new \RuntimeException('Prerender generation command failed.');
        }

        Log::info('Prerender pages regenerated after listing content changed.');
    }
}
