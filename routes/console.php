<?php

use App\Domain\Listings\Models\Setting;
use App\Domain\Points\Jobs\AutoDeleteReviewJob;
use App\Domain\Points\Jobs\MonthlyResetJob;
use App\Domain\Points\Services\PointsService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schedule;

Artisan::command('prerender:data', function () {
    return $this->call(\App\Console\Commands\ExportPrerenderData::class);
})->purpose('Export all public page route HTML templates and Inertia page objects for static prerendering');

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * Shared-hosting resilience strategy
 * ----------------------------------
 * Shared hosting crons fire intermittently, so tasks must not depend on
 * hitting one exact minute. Daily tasks are scheduled hourly and claim a
 * day/month key via Cache::add (atomic), making them run exactly once per
 * period at the FIRST successful cron tick — immune to missed windows.
 */

Artisan::command('points:daily-deduct', function () {
    $count = app(PointsService::class)->deductDailyPoints();
    $this->info("Successfully deducted daily points from {$count} units.");
})->purpose('Deduct daily points from non-pinned units (DB-level idempotent: safe at any frequency)');

Artisan::command('points:monthly-reset', function () {
    $key = 'monthly_reset_done_'.now()->format('Y-m');
    if (! Cache::add($key, true, now()->addDays(40)->diffInSeconds(now()))) {
        $this->info('Monthly reset already performed this month.');

        return self::SUCCESS;
    }

    try {
        dispatch(new MonthlyResetJob);
    } catch (\Throwable $e) {
        Cache::forget($key);
        throw $e;
    }
})->purpose('Reset all manager points to their initial monthly balance (once per month)');

Artisan::command('units:check-expiry', function () {
    $key = 'expiry_review_done_'.now()->toDateString();
    if (! Cache::add($key, true, 60 * 60 * 25)) {
        $this->info('Expiry review already completed today.');

        return self::SUCCESS;
    }

    try {
        dispatch(new AutoDeleteReviewJob);
    } catch (\Throwable $e) {
        Cache::forget($key);
        throw $e;
    }
})->purpose('Flag expired units as pending review for admin (once per day, first successful tick wins)');

Schedule::command('queue:work --stop-when-empty --max-time=50 --tries=3 --timeout=60')
    ->everyMinute()
    ->runInBackground()
    ->withoutOverlapping(10);

Schedule::command('points:daily-deduct')
    ->hourly()
    ->withoutOverlapping(10)
    ->onOneServer();

Schedule::command('points:monthly-reset')
    ->hourly()
    ->withoutOverlapping(10)
    ->onOneServer()
    ->when(function () {
        $enabled = Setting::getValue('monthly_reset_auto', 'false');
        $day = (int) Setting::getValue('monthly_reset_day', '1');

        return $enabled === 'true' && now()->day === $day;
    });

Schedule::command('units:check-expiry')
    ->hourly()
    ->withoutOverlapping(10)
    ->onOneServer();

Schedule::command('notifications:cleanup')
    ->dailyAt('03:00')
    ->timezone('Africa/Cairo')
    ->withoutOverlapping(10);

Schedule::command('points:cleanup')
    ->dailyAt('03:30')
    ->timezone('Africa/Cairo')
    ->withoutOverlapping(10);

Schedule::command('app:backup-db')
    ->hourly()
    ->withoutOverlapping(10);

Schedule::command('backup:clean')
    ->dailyAt('04:30')
    ->timezone('Africa/Cairo')
    ->withoutOverlapping(10);

Schedule::command('sitemap:generate')
    ->hourly()
    ->withoutOverlapping(10);
