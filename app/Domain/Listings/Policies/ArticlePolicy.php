<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\Article;
use App\Domain\Users\Models\User;

class ArticlePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }

    public function togglePublish(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }
}
