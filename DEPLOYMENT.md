# Production deployment checklist

## Before upload

1. Run `composer install --no-dev --optimize-autoloader` and `npm ci && npm run build` locally or in CI.
2. Upload the application outside the web root. Set the domain document root to the application's `public/` directory only.
3. Never upload `.env`, local logs, test data, or `node_modules` to the public directory.

## Required production environment

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://familyhome-co.com
LOG_LEVEL=warning
CACHE_STORE=database
QUEUE_CONNECTION=database
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

Set `TRUSTED_PROXIES` only to proxy addresses supplied by the host. Do not use `*`.

## First deploy and every release

> **IMPORTANT:** Never run `php artisan db:seed --class=DemoDataSeeder` on production environments. Seeding demo data will fail by design to prevent security breaches and accidental test data creation. Production deployments only require running standard migrations.

```bash
php artisan migrate --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

After uploading new front-end assets, purge Hostinger/CDN cache and hard-refresh the browser. A stale JavaScript bundle can send an Inertia navigation request to a JSON endpoint and cause the error: `All Inertia requests must receive a valid Inertia response`.

## Scheduled and queued work

Configure the scheduler once per minute:

```cron
* * * * * cd /absolute/path/to/application && php artisan schedule:run >> /dev/null 2>&1
```

Run a queue worker when the hosting plan supports a persistent process. Otherwise configure a scheduled worker suitable for the host, and monitor failed jobs with `php artisan queue:failed`.

## Post-deploy checks

1. Log in, open the notification panel, and confirm both unread-count endpoints return JSON.
2. Confirm `https://familyhome-co.com/storage/...` serves uploaded images.
3. Check `storage/logs/laravel.log` for errors and run `php artisan queue:failed`.
4. Verify `APP_DEBUG=false`, HTTPS-only session cookies, and the web root is `public/`.
