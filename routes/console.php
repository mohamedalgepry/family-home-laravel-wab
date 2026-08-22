<?php

use App\Domain\Listings\Models\Setting;
use App\Domain\Points\Jobs\AutoDeleteReviewJob;
use App\Domain\Points\Jobs\MonthlyResetJob;
use App\Domain\Points\Services\PointsService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('points:daily-deduct', function () {
    $count = app(PointsService::class)->deductDailyPoints();
    $this->info("Successfully deducted daily points from {$count} units.");
})->purpose('Deduct daily points from non-pinned units');

Artisan::command('points:monthly-reset', function () {
    dispatch(new MonthlyResetJob);
})->purpose('Reset all manager points to their initial monthly balance');

Artisan::command('units:check-expiry', function () {
    dispatch(new AutoDeleteReviewJob);
})->purpose('Flag expired units as pending review for admin');

Schedule::command('queue:work --stop-when-empty --max-time=50 --tries=3 --timeout=180')
    ->everyMinute()
    ->withoutOverlapping();

Schedule::command('points:daily-deduct')
    ->dailyAt('00:01')
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('points:monthly-reset')
    ->dailyAt('01:00')
    ->withoutOverlapping()
    ->onOneServer()
    ->when(function () {
        $enabled = Setting::getValue('monthly_reset_auto', 'false');
        $day = (int) Setting::getValue('monthly_reset_day', '1');

        return $enabled === 'true' && now()->day === $day;
    });

Schedule::command('units:check-expiry')
    ->dailyAt('02:00')
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('notifications:cleanup')
    ->dailyAt('03:00')
    ->withoutOverlapping();

Schedule::command('app:backup-db')
    ->dailyAt('03:00')
    ->withoutOverlapping();

Schedule::command('backup:clean')
    ->dailyAt('04:30')
    ->withoutOverlapping();

Schedule::command('sitemap:generate')
    ->hourly()
    ->withoutOverlapping();
