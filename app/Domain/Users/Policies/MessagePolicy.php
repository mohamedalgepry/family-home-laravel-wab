<?php

namespace App\Domain\Users\Policies;

use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;

class MessagePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager', 'agent'], true);
    }

    public function view(User $user, Message $message): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $message->agent_id === $user->id
                || $user->agents()->where('id', $message->agent_id)->exists();
        }

        return $message->agent_id === $user->id;
    }

    public function markAsReplied(User $user, Message $message): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isManager()) {
            return $message->agent_id === $user->id
                || $user->agents()->where('id', $message->agent_id)->exists();
        }

        return $message->agent_id === $user->id;
    }

    public function delete(User $user, Message $message): bool
    {
        return $user->isAdmin();
    }
}
