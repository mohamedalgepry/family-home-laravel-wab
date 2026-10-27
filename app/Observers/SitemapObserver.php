<?php

namespace App\Observers;

use App\Domain\Listings\Jobs\RegeneratePrerenderJob;
use App\Domain\Listings\Jobs\RegenerateSitemapJob;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use Illuminate\Database\Eloquent\Model;

class SitemapObserver
{
    private function triggerRegeneration(Model $model): void
    {
        if (! $model->wasRecentlyCreated && ! $this->hasContentChanges($model)) {
            return;
        }

        dispatch(new RegenerateSitemapJob)->afterCommit();

        if ($model instanceof Unit || $model instanceof Project || $model instanceof Article) {
            dispatch(new RegeneratePrerenderJob)->afterCommit();
        }
    }

    private function hasContentChanges(Model $model): bool
    {
        $changedAttributes = array_diff(array_keys($model->getChanges()), ['views_count', 'updated_at']);

        return $changedAttributes !== [];
    }

    public function saved(Model $model): void
    {
        $this->triggerRegeneration($model);
    }

    public function deleted(Model $model): void
    {
        dispatch(new RegenerateSitemapJob)->afterCommit();
        if ($model instanceof Unit || $model instanceof Project || $model instanceof Article) {
            dispatch(new RegeneratePrerenderJob)->afterCommit();
        }
    }

    public function restored(Model $model): void
    {
        $this->triggerRegeneration($model);
    }
}
