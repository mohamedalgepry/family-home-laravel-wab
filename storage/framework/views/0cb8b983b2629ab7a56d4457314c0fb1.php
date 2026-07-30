<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" dir="<?php echo e(session('locale', 'en') === 'ar' ? 'rtl' : 'ltr'); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <meta name="google-site-verification" content="0KaNSaKJZ4bzZ34V2h1GSuFfSlyUMZVMujKj1F8iwE0" />
    <?php
        $siteLogo = app(\App\Domain\Listings\Services\SettingsService::class)->get('site_logo');
        $faviconUrl = $siteLogo ? asset('storage/' . $siteLogo) : asset('icon.png');
    ?>
    <link rel="icon" type="image/png" href="<?php echo e($faviconUrl); ?>">
    <link rel="apple-touch-icon" href="<?php echo e($faviconUrl); ?>">
    <?php
        $defaultTitle = request()->is('admin*')
            ? __('common.admin_panel') . ' — ' . __('common.app_name')
            : __('common.app_name');
    ?>
    <?php if(isset($meta)): ?>
        <?php if(isset($meta['canonical'])): ?>
            <link rel="canonical" href="<?php echo e($meta['canonical']); ?>">
        <?php endif; ?>
        <?php if(isset($meta['hreflang'])): ?>
            <?php $__currentLoopData = $meta['hreflang']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $lang => $url): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <link rel="alternate" hreflang="<?php echo e($lang); ?>" href="<?php echo e($url); ?>">
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <?php endif; ?>
        <title><?php echo e($meta['title'] ?? $defaultTitle); ?></title>
        <meta name="description" content="<?php echo e($meta['description'] ?? ''); ?>">
        <meta property="og:title" content="<?php echo e($meta['title'] ?? $defaultTitle); ?>">
        <meta property="og:description" content="<?php echo e($meta['description'] ?? ''); ?>">
        <?php if(isset($meta['image'])): ?>
            <meta property="og:image" content="<?php echo e(asset('storage/' . $meta['image'])); ?>">
            <meta name="twitter:image" content="<?php echo e(asset('storage/' . $meta['image'])); ?>">
        <?php else: ?>
            <meta property="og:image" content="<?php echo e($faviconUrl); ?>">
            <meta name="twitter:image" content="<?php echo e($faviconUrl); ?>">
        <?php endif; ?>
        <?php if(isset($meta['schema'])): ?>
            <script type="application/ld+json"><?php echo e(json_encode($meta['schema'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)); ?></script>
        <?php endif; ?>
    <?php else: ?>
        <title><?php echo e($defaultTitle); ?></title>
        <meta property="og:image" content="<?php echo e($faviconUrl); ?>">
        <meta name="twitter:image" content="<?php echo e($faviconUrl); ?>">
    <?php endif; ?>
    <meta property="og:image:width" content="512">
    <meta property="og:image:height" content="512">
    <meta name="twitter:card" content="summary_large_image">
    <?php echo app('Illuminate\Foundation\Vite')(['resources/js/app.jsx', 'resources/css/app.css']); ?>
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>
</head>
<body>
    <?php $__inertiaSsrResponse = app(\Inertia\Ssr\SsrState::class)->setPage($page)->dispatch();  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><script data-page="app" type="application/json"><?php echo json_encode($page); ?></script><div id="app"></div><?php } ?>
</body>
</html>
<?php /**PATH D:\family-home-laravel-wab-main0\family-home-laravel-wab-main\resources\views/app.blade.php ENDPATH**/ ?>