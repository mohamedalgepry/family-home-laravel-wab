<?php

namespace App\Domain\Listings\Jobs;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Notifications\NewProjectCreatedNotification;
use App\Domain\Users\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class NotifyNewProjectJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 60;

    public function __construct(
        private readonly Project $project,
    ) {}

    public function handle(): void
    {
        $user = $this->project->user;

        $admins = User::where('role', 'admin')->get(['id']);

        foreach ($admins as $admin) {
            $admin->notify(new NewProjectCreatedNotification($this->project, $user));
            Cache::forget("user_{$admin->id}_unread_count");
        }
    }
}
