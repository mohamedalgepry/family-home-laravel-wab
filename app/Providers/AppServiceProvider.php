<?php

namespace App\Providers;

use App\Domain\Listings\Models\AboutPage;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\Article;
use App\Domain\Listings\Models\Category;
use App\Domain\Listings\Models\Feature;
use App\Domain\Listings\Models\FinishingType;
use App\Domain\Listings\Models\PageSeo;
use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Setting;
use App\Domain\Listings\Models\Unit;
use App\Domain\Listings\Models\UnitType;
use App\Domain\Listings\Policies\AboutPagePolicy;
use App\Domain\Listings\Policies\AreaPolicy;
use App\Domain\Listings\Policies\ArticlePolicy;
use App\Domain\Listings\Policies\CategoryPolicy;
use App\Domain\Listings\Policies\FeaturePolicy;
use App\Domain\Listings\Policies\FinishingTypePolicy;
use App\Domain\Listings\Policies\PageSeoPolicy;
use App\Domain\Listings\Policies\ProjectPolicy;
use App\Domain\Listings\Policies\SettingPolicy;
use App\Domain\Listings\Policies\UnitPolicy;
use App\Domain\Listings\Policies\UnitTypePolicy;
use App\Domain\Points\Policies\AllocatePointsPolicy;
use App\Domain\Users\Models\Message;
use App\Domain\Users\Models\User;
use App\Domain\Users\Policies\MessagePolicy;
use App\Domain\Users\Policies\UserPolicy;
use App\Observers\LookupObserver;
use App\Observers\SitemapObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Model::preventLazyLoading(! app()->isProduction());

        $frameworkDirs = [
            storage_path('framework/views'),
            storage_path('framework/cache/data'),
            storage_path('framework/sessions'),
            storage_path('framework/testing'),
            public_path('storage'),
            storage_path('logs'),
        ];

        foreach ($frameworkDirs as $dir) {
            if (! is_dir($dir)) {
                @mkdir($dir, 0775, true);
            }
        }

        Area::observe(LookupObserver::class);
        UnitType::observe(LookupObserver::class);
        Feature::observe(LookupObserver::class);
        FinishingType::observe(LookupObserver::class);

        Unit::observe(SitemapObserver::class);
        Project::observe(SitemapObserver::class);
        Article::observe(SitemapObserver::class);
        Area::observe(SitemapObserver::class);

        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Unit::class, UnitPolicy::class);
        Gate::policy(Article::class, ArticlePolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(AboutPage::class, AboutPagePolicy::class);
        Gate::policy(Setting::class, SettingPolicy::class);
        Gate::policy(Message::class, MessagePolicy::class);
        Gate::policy(Area::class, AreaPolicy::class);
        Gate::policy(UnitType::class, UnitTypePolicy::class);
        Gate::policy(Feature::class, FeaturePolicy::class);
        Gate::policy(FinishingType::class, FinishingTypePolicy::class);
        Gate::policy(PageSeo::class, PageSeoPolicy::class);

        Gate::define('allocate-points', [AllocatePointsPolicy::class, 'allocate']);

        RateLimiter::for('login', function (Request $request) {
            $key = $request->input('email').'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });

        RateLimiter::for('contact-form', function (Request $request) {
            return Limit::perHour(5)->by($request->ip());
        });

        RateLimiter::for('search', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });

        RateLimiter::for('property-search', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });

        Vite::useStyleTagAttributes(fn (string $src, string $url, array $chunk, array $manifest) => [
            'media' => 'print',
            'onload' => "this.media='all'",
        ]);
    }
}
