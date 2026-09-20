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
        // Inertia link prefetches (hover) send Purpose: prefetch and browsers
        // send Sec-Purpose: prefetch — they are not real visits, so they must
        // not inflate view counters or analytics.
        $purpose = strtolower((string) request()->headers->get('Purpose'));
        $secPurpose = strtolower((string) request()->headers->get('Sec-Purpose'));

        if (in_array($purpose, ['prefetch', 'preview'], true) || str_contains($secPurpose, 'prefetch')) {
            return;
        }

        if ($ip && $ip !== '127.0.0.1' && $ip !== '::1') {
            $cacheKey = "pageview_{$viewableType}_{$viewableId}_{$ip}";

            if (Cache::has($cacheKey)) {
                return;
            }

            Cache::put($cacheKey, true, self::DEDUP_CACHE_TTL);
        }

        dispatch(new RecordPageViewJob($viewableType, $viewableId, $ip, $userAgent))->afterCommit();
    }

    public function incrementCounterCache(string $viewableType, int $viewableId): void
    {
        $model = $this->resolveModel($viewableType, $viewableId);

        if ($model) {
            // Don't touch updated_at: a view is not a content change. Bumping it
            // would churn <lastmod> in the sitemap and invalidate HTTP/CDN caches
            // on every single visit.
            $model->timestamps = false;
            $model->increment('views_count');
            $model->timestamps = true;
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
