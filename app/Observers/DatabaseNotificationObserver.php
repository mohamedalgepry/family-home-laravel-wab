<?php

namespace App\Observers;

use App\Domain\Users\Models\User;
use App\Domain\Users\Services\NotificationService;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Notifications\DatabaseNotification;

class DatabaseNotificationObserver
{
    public function created(DatabaseNotification $notification): void
    {
        $notifiableType = Relation::getMorphedModel($notification->notifiable_type)
            ?? $notification->notifiable_type;

        if (! is_a($notifiableType, User::class, true)) {
            return;
        }

        app(NotificationService::class)->clearCacheForUserId((int) $notification->notifiable_id);
    }
}
