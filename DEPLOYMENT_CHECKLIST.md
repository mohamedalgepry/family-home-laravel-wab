# Family Home Deployment Checklist

## Environment Configuration (`.env`)
- `APP_ENV=production`
- `APP_DEBUG=false`
- `LOG_LEVEL=error`
- `SESSION_SECURE_COOKIE=true`
- `SESSION_SAME_SITE=lax`
- Enforce HTTPS across all traffic

## Server & Application Setup
- **Cron Setup**: Ensure the Laravel scheduler is running every minute (`* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1`).
- **Queue Worker**: Configure Supervisor (or similar) to keep `php artisan queue:work` running continuously to process emails and background tasks.
- **Storage Symlinks**: Run `php artisan storage:link` to make public storage accessible.
- **Directory Permissions**: Ensure `storage/` and `bootstrap/cache/` directories are writable by the web server (e.g., `chmod -R 775 storage bootstrap/cache`).
- **Trusted Proxies**: Configure `App\Http\Middleware\TrustProxies` if deploying behind a load balancer or reverse proxy like Cloudflare.
- **Backup Verification**: Verify that automated database and storage backups are properly configured and tested.
