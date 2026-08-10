<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Public\AreaController as PublicAreaController;
use App\Http\Controllers\Public\ArticleController;
use App\Http\Controllers\Public\ComparisonController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\MessageController;
use App\Http\Controllers\Public\ProjectController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Public\UnitController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// فحص صحة قاعدة البيانات — متاح بدون مصادقة، لا يكشف بيانات حساسة
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();

        return response()->json(['status' => 'ok', 'database' => 'connected']);
    } catch (\Throwable $e) {
        return response()->json(['status' => 'error', 'database' => 'unavailable'], 503);
    }
})->name('health.check');

Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/sitemap-static.xml', [SitemapController::class, 'static']);
Route::get('/sitemap-units.xml', [SitemapController::class, 'units']);
Route::get('/sitemap-projects.xml', [SitemapController::class, 'projects']);
Route::get('/sitemap-areas.xml', [SitemapController::class, 'areas']);
Route::get('/sitemap-articles.xml', [SitemapController::class, 'articles']);

Route::get('/robots.txt', [SitemapController::class, 'robots']);

Route::get('/storage/{path}', function ($path) {
    // منع Path Traversal
    if (str_contains($path, '..')) {
        abort(404);
    }

    $filePath = storage_path('app/public/'.$path);

    $real = realpath($filePath);
    if ($real === false || ! str_starts_with($real, realpath(storage_path('app/public')))) {
        abort(404);
    }

    if (file_exists($filePath)) {
        return response()->file($filePath);
    }

    if (str_contains($path, 'settings') || str_contains($path, 'logo')) {
        $defaultIcon = public_path('icon.png');
        if (file_exists($defaultIcon)) {
            return response()->file($defaultIcon);
        }
    }

    abort(404);
})->where('path', '.*');

use App\Http\Controllers\Admin\AboutController;
use App\Http\Controllers\Admin\AreaController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\FinishingTypeController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\PageSeoController;
use App\Http\Controllers\Admin\PointsController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UnitTypeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Public\AgentController;
use App\Http\Controllers\Public\PageController;
use App\Http\Middleware\SetLocale;

Route::get('/locale/{lang}', [PageController::class, 'switchLocale'])->name('locale.switch');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/forgot-password', [LoginController::class, 'forgotPassword'])->name('password.request');
    Route::post('/forgot-password', [LoginController::class, 'sendResetLink'])->name('password.email');
    Route::get('/verify-otp', [LoginController::class, 'showVerifyOtpForm'])->name('password.otp');
    Route::post('/verify-otp', [LoginController::class, 'verifyOtp'])->name('password.otp.verify');
    Route::get('/reset-password/{token?}', [LoginController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [LoginController::class, 'resetPassword'])->name('password.update');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar');
    Route::put('/password', [ProfileController::class, 'changePassword'])->name('password.change');
});

Route::get('/', [PageController::class, 'rootRedirect'])->name('root');

Route::prefix('{locale}')->whereIn('locale', ['ar', 'en'])->middleware(SetLocale::class)->group(function () {
    Route::get('/', HomeController::class)->name('home');

    Route::middleware('guest')->group(function () {
        Route::get('/login', [LoginController::class, 'create']);
        Route::post('/login', [LoginController::class, 'store']);
        Route::get('/forgot-password', [LoginController::class, 'forgotPassword']);
        Route::post('/forgot-password', [LoginController::class, 'sendResetLink']);
        Route::get('/verify-otp', [LoginController::class, 'showVerifyOtpForm']);
        Route::post('/verify-otp', [LoginController::class, 'verifyOtp']);
        Route::get('/reset-password/{token?}', [LoginController::class, 'showResetForm']);
        Route::post('/reset-password', [LoginController::class, 'resetPassword']);
    });

    Route::prefix('units')->group(function () {
        Route::get('/', [UnitController::class, 'index'])->middleware('throttle:search');
        Route::get('/deals', [UnitController::class, 'deals'])->middleware('throttle:search');
        Route::get('/{slug}', [UnitController::class, 'show'])->middleware('throttle:property-search');
    });

    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->middleware('throttle:search');
        Route::get('/{slug}', [ProjectController::class, 'show'])->middleware('throttle:property-search');
    });

    Route::prefix('areas')->group(function () {
        Route::get('/{slug}', [PublicAreaController::class, 'show'])->middleware('throttle:property-search')->name('areas.show');
    });

    Route::prefix('articles')->group(function () {
        Route::get('/', [ArticleController::class, 'index'])->middleware('throttle:search');
        Route::get('/{slug}', [ArticleController::class, 'show'])->middleware('throttle:property-search');
    });

    Route::get('/agents/{id}', [AgentController::class, 'show'])->middleware('throttle:property-search')->name('agents.show');

    Route::get('/compare', [ComparisonController::class, 'index'])->middleware('throttle:property-search');
    Route::get('/compare/search', [ComparisonController::class, 'search'])
        ->middleware('throttle:search')
        ->name('compare.search');

    Route::get('/about', [PageController::class, 'about']);
    Route::get('/contact', [PageController::class, 'contact']);
    Route::post('/contact', [MessageController::class, 'storeContact'])
        ->middleware('throttle:contact-form');

    Route::post('/units/{unit:slug}/contact', [MessageController::class, 'store'])
        ->middleware('throttle:contact-form');
});

Route::post('/contact', [MessageController::class, 'storeContact'])
    ->middleware('throttle:contact-form');
Route::post('/units/{unit:slug}/contact', [MessageController::class, 'store'])
    ->middleware('throttle:contact-form');

Route::prefix('admin')->middleware(['auth', 'role:admin,manager,agent'])->group(function () {
    Route::get('/', DashboardController::class)->name('admin.dashboard');
    Route::post('/media/upload', [MediaController::class, 'upload'])->name('admin.media.upload');

    Route::prefix('units')->name('admin.units.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\UnitController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\UnitController::class, 'create'])->name('create');
        Route::get('/{unit}/edit', [App\Http\Controllers\Admin\UnitController::class, 'edit'])->name('edit');
        Route::post('/', [App\Http\Controllers\Admin\UnitController::class, 'store'])->name('store');
        Route::put('/{unit}', [App\Http\Controllers\Admin\UnitController::class, 'update'])->name('update');
        Route::delete('/{unit}', [App\Http\Controllers\Admin\UnitController::class, 'destroy'])->name('destroy');
        Route::post('/{unit}/pin', [App\Http\Controllers\Admin\UnitController::class, 'togglePin'])->name('toggle-pin');
        Route::post('/{unit}/deal', [App\Http\Controllers\Admin\UnitController::class, 'toggleDeal'])->name('toggle-deal');
        Route::post('/{unit}/active', [App\Http\Controllers\Admin\UnitController::class, 'toggleActive'])->name('toggle-active');
        Route::post('/{unit}/adjust-points', [App\Http\Controllers\Admin\UnitController::class, 'adjustPoints'])->name('adjust-points');
        Route::delete('/{unit}/images/{image}', [App\Http\Controllers\Admin\UnitController::class, 'removeImage'])->name('images.remove');
        Route::post('/{unit}/images/{image}/primary', [App\Http\Controllers\Admin\UnitController::class, 'setPrimaryImage'])->name('images.set-primary');
    });

    Route::prefix('projects')->name('admin.projects.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\ProjectController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\ProjectController::class, 'create'])->name('create');
        Route::get('/{project}/autofill', [App\Http\Controllers\Admin\ProjectController::class, 'autofill'])->name('autofill');
        Route::get('/{project}/edit', [App\Http\Controllers\Admin\ProjectController::class, 'edit'])->name('edit');
        Route::post('/', [App\Http\Controllers\Admin\ProjectController::class, 'store'])->name('store');
        Route::put('/{project}', [App\Http\Controllers\Admin\ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [App\Http\Controllers\Admin\ProjectController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('points')->name('admin.points.')->middleware('role:admin,manager')->group(function () {
        Route::get('/', [PointsController::class, 'index'])->name('index');
        Route::post('/allocate', [PointsController::class, 'allocate'])->name('allocate');
        Route::post('/reset', [PointsController::class, 'monthlyReset'])->middleware('role:admin')->name('monthly-reset');
        Route::post('/daily-deduct', [PointsController::class, 'dailyDeduct'])->middleware('role:admin')->name('daily-deduct');
    });

    Route::prefix('users')->name('admin.users.')->middleware('role:admin')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::post('/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('toggle-active');
        Route::post('/transfer-projects', [UserController::class, 'transferProjects'])->name('transfer-projects');
        Route::post('/assign-agents', [UserController::class, 'assignAgents'])->name('assign-agents');
        Route::post('/{user}/change-password', [UserController::class, 'changePassword'])->name('change-password');
        Route::get('/{user}/check-relations', [UserController::class, 'checkRelations'])->name('check-relations');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('messages')->name('admin.messages.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\MessageController::class, 'index'])->name('index');
        Route::get('/unread-count', [App\Http\Controllers\Admin\MessageController::class, 'unreadCount'])->name('unread-count');
        Route::post('/{message}/replied', [App\Http\Controllers\Admin\MessageController::class, 'markAsReplied'])->name('mark-replied');
        Route::delete('/{message}', [App\Http\Controllers\Admin\MessageController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('notifications')->name('admin.notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/recent', [NotificationController::class, 'recent'])->name('recent');
        Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
        Route::delete('/all/clear', [NotificationController::class, 'clearAll'])->name('clear-all');
    });

    Route::post('/projects/{project}/approve', [NotificationController::class, 'approveProject'])->name('admin.projects.approve');
    Route::post('/units/{unit}/approve', [NotificationController::class, 'approveUnit'])->name('admin.units.approve');
    Route::post('/projects/{project}/extend', [NotificationController::class, 'extendProject'])->name('admin.projects.extend');
    Route::post('/units/{unit}/extend-expiry', [NotificationController::class, 'extendUnit'])->name('admin.units.extend-expiry');
    Route::delete('/units/{unit}/force', [NotificationController::class, 'deleteUnit'])->middleware('role:admin')->name('admin.units.force-delete');
    Route::post('/notifications/{id}/dismiss', [NotificationController::class, 'dismissNotification'])->name('admin.notifications.dismiss');

    Route::prefix('settings')->name('admin.settings.')->middleware('role:admin')->group(function () {
        Route::get('/', [SettingsController::class, 'index'])->name('index');
        Route::post('/', [SettingsController::class, 'update'])->name('update');
    });

    Route::prefix('articles')->name('admin.articles.')->middleware('role:admin')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\ArticleController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\ArticleController::class, 'create'])->name('create');
        Route::get('/{article}/edit', [App\Http\Controllers\Admin\ArticleController::class, 'edit'])->name('edit');
        Route::post('/', [App\Http\Controllers\Admin\ArticleController::class, 'store'])->name('store');
        Route::put('/{article}', [App\Http\Controllers\Admin\ArticleController::class, 'update'])->name('update');
        Route::delete('/{article}', [App\Http\Controllers\Admin\ArticleController::class, 'destroy'])->name('destroy');
        Route::post('/{article}/publish', [App\Http\Controllers\Admin\ArticleController::class, 'togglePublish'])->name('toggle-publish');
    });

    Route::prefix('categories')->name('admin.categories.')->middleware('role:admin')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('about')->name('admin.about.')->middleware('role:admin')->group(function () {
        Route::get('/', [AboutController::class, 'edit'])->name('edit');
        Route::post('/', [AboutController::class, 'update'])->name('update');
    });

    Route::prefix('areas')->name('admin.areas.')->middleware('role:admin')->group(function () {
        Route::get('/', [AreaController::class, 'index'])->name('index');
        Route::get('/create', [AreaController::class, 'create'])->name('create');
        Route::get('/{area}/edit', [AreaController::class, 'edit'])->name('edit');
        Route::post('/', [AreaController::class, 'store'])->name('store');
        Route::put('/{area}', [AreaController::class, 'update'])->name('update');
        Route::delete('/{area}', [AreaController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('profile')->name('admin.profile.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('edit');
        Route::post('/', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('update');
        Route::post('/send-email-otp', [App\Http\Controllers\Admin\ProfileController::class, 'sendEmailOtp'])->name('send-email-otp');
        Route::post('/verify-email-otp', [App\Http\Controllers\Admin\ProfileController::class, 'verifyEmailOtp'])->name('verify-email-otp');
    });

    Route::prefix('unit-types')->name('admin.unit-types.')->middleware('role:admin')->group(function () {
        Route::get('/', [UnitTypeController::class, 'index'])->name('index');
        Route::post('/', [UnitTypeController::class, 'store'])->name('store');
        Route::put('/{unitType}', [UnitTypeController::class, 'update'])->name('update');
        Route::delete('/{unitType}', [UnitTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('features')->name('admin.features.')->middleware('role:admin')->group(function () {
        Route::get('/', [FeatureController::class, 'index'])->name('index');
        Route::post('/', [FeatureController::class, 'store'])->name('store');
        Route::put('/{feature}', [FeatureController::class, 'update'])->name('update');
        Route::delete('/{feature}', [FeatureController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('finishing-types')->name('admin.finishing-types.')->middleware('role:admin')->group(function () {
        Route::get('/', [FinishingTypeController::class, 'index'])->name('index');
        Route::post('/', [FinishingTypeController::class, 'store'])->name('store');
        Route::put('/{finishingType}', [FinishingTypeController::class, 'update'])->name('update');
        Route::delete('/{finishingType}', [FinishingTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('seo-pages')->name('admin.seo-pages.')->middleware('role:admin')->group(function () {
        Route::get('/', [PageSeoController::class, 'index'])->name('index');
        Route::put('/{pageSeo}', [PageSeoController::class, 'update'])->name('update');
    });
});
