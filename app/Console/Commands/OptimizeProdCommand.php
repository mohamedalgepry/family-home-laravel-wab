<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class OptimizeProdCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:optimize-prod';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize the application for production (cache routes, config, views, and events)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting production optimization...');

        $this->call('config:cache');
        $this->call('route:cache');
        $this->call('view:cache');
        $this->call('event:cache');

        $this->info('Application optimized for production successfully!');

        $this->warn('Remember to run: composer install --optimize-autoloader --no-dev');
        $this->warn('If using OPcache, ensure it is enabled in your php.ini');
    }
}
