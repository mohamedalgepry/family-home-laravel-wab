<?php

namespace App\Domain\Listings\Services;

use App\Domain\Listings\Jobs\RecordPageViewJob;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class PageViewService
{
    private const DEDUP_CACHE_TTL = 120; // 2 minutes dedup per IP

    public function recordView(string $viewableType, int $viewableId, ?string $ip = null, ?string $userAgent = null): void
    {
        if ($ip && $ip !== '127.0.0.1' && $ip !== '::1') {
            $cacheKey = "pageview_{$viewableType}_{$viewableId}_{$ip}";

            if (Cache::has($cacheKey)) {
                return;
            }

            Cache::put($cacheKey, true, self::DEDUP_CACHE_TTL);
        }

        dispatch_sync(new RecordPageViewJob($viewableType, $viewableId, $ip, $userAgent));
    }

    public function incrementCounterCache(string $viewableType, int $viewableId): void
    {
        $model = $this->resolveModel($viewableType, $viewableId);

        if ($model) {
            $model->increment('views_count');
        }
    }

    private function resolveModel(string $viewableType, int $viewableId): ?Model
    {
        if (! class_exists($viewableType)) {
            return null;
        }

        $instance = app($viewableType);

        if (! $instance instanceof Model) {
            return null;
        }

        return $instance->find($viewableId);
    }
}
