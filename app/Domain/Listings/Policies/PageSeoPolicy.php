<?php

namespace App\Domain\Listings\Policies;

use App\Domain\Listings\Models\PageSeo;
use App\Domain\Users\Models\User;

class PageSeoPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, ?PageSeo $pageSeo = null): bool
    {
        return $user->isAdmin();
    }
}
