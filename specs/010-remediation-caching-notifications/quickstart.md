# Quickstart Validation Guide: Remediation, Caching & Notifications

**Feature**: `010-remediation-caching-notifications`

---

## 1. Prerequisites
- PHP 8.2+
- Node.js 20+
- Composer & NPM

---

## 2. Validation Steps

### Step 1: Validate Frontend Vulnerability Fix
```bash
npm audit
# Expected result: 0 vulnerabilities (or only unfixable breaking ones)
```

### Step 2: Validate Login Route Throttle
```bash
php artisan route:list | grep "login"
# Expected output: POST login includes throttle:login middleware
```

### Step 3: Validate Area Image Optimization
```bash
# Upload an area image via admin and check generated files
ls -la storage/app/public/areas/
```

### Step 4: Validate Cache Invalidation Flow
```bash
# Test cache version increment in tinker
php artisan tinker --execute="echo 'Version: ' . \Illuminate\Support\Facades\Cache::get('listing_cache_version', 1);"
```

### Step 5: Validate Notification Count and Realtime Flow
```bash
# Check notification endpoints
curl -I http://localhost/admin/notifications/unread-count
```

