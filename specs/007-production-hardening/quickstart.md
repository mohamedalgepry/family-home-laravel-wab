# Quickstart Validation Guide: Production Hardening

## Prerequisites

- PHP 8.2+ with Laravel installed
- Node.js 20+ with npm
- MySQL 8.0+
- Access to project at `d:\New-family`

## Validation Scenarios

### 1. Security — Credential Removal

```bash
# Verify no hardcoded passwords in SQL dump
grep -c "admin@admin.com" database/database.sql
# Expected: 0 (after fix)

# Verify seeder uses env password
grep "env('ADMIN_SEED_PASSWORD'" database/seeders/DatabaseSeeder.php
# Expected: match found

# Test admin creation command
php artisan app:create-admin
# Expected: Interactive prompts for email + password, success message
```

### 2. Security — Path Traversal

```bash
# Test traversal blocking (requires running server)
curl -s -o /dev/null -w "%{http_code}" -A "Googlebot" "http://localhost:8000/../../etc/passwd"
# Expected: 403 or 200 (normal page, not file contents)

curl -s -o /dev/null -w "%{http_code}" -A "Googlebot" "http://localhost:8000/%2e%2e/%2e%2e/etc/passwd"
# Expected: 403 or 200 (normal page)
```

### 3. Security — Headers

```bash
curl -sI "http://localhost:8000/ar" | grep -i "x-content-type-options\|x-frame-options\|referrer-policy\|permissions-policy\|content-security-policy"
# Expected: All 5 headers present
# CSP should contain: object-src 'none'; base-uri 'self'
```

### 4. Double Encoding — Dry Run

```bash
php artisan app:fix-double-encoding --dry-run
# Expected: List of affected records with before/after values
# No &amp;amp patterns should remain after fix
```

### 5. AI Assistant — Timeout

```bash
# Verify config defaults
php artisan tinker --execute="echo config('assistant.total_budget_seconds')"
# Expected: 15

php artisan tinker --execute="echo config('assistant.per_request_timeout_seconds')"
# Expected: 10
```

### 6. Leads Cleanup

```bash
php artisan leads:cleanup --days=90
# Expected: "Deleted X assistant lead records older than 90 days."
```

### 7. Build Verification

```bash
# Backend
php artisan test
# Expected: All tests pass

# Frontend
npm run build
# Expected: Build succeeds with no errors

# Laravel cache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
# Expected: All succeed
```

### 8. SEO — Meta Validation

```bash
# Check for double-encoded entities in rendered output
curl -s "http://localhost:8000/ar" | grep -c "&amp;amp"
# Expected: 0

# Check canonical exists and is unique
curl -s "http://localhost:8000/ar" | grep -c 'rel="canonical"'
# Expected: 1

# Check hreflang tags
curl -s "http://localhost:8000/ar" | grep -c 'hreflang='
# Expected: 3 (ar, en, x-default)
```

### 9. Accessibility — Keyboard Navigation

Manual browser testing:
1. Open property detail page → click gallery image → lightbox opens
2. Press `Escape` → lightbox closes
3. Press `ArrowRight` / `ArrowLeft` → images navigate
4. Open mobile menu (resize to mobile) → press `Escape` → menu closes
5. Tab through form elements → focus visible on all interactive elements

### 10. Performance — Bundle Analysis

```bash
npm run build 2>&1 | grep -E "vendor-recharts|vendor-tiptap"
# Expected: These chunks exist but are NOT referenced by public page chunks
```

## Expected Outcomes

| Check | Expected Result |
|-------|----------------|
| `php artisan test` | All pass, no regression |
| `npm run build` | Zero errors |
| Default credentials in git | None |
| Path traversal via prerender | Blocked (403 or ignored) |
| Security headers on responses | All 5 present + CSP enhanced |
| CORS wildcard on HTML | Absent |
| Double-encoded entities visible | None |
| Duplicate DOM sections | None |
| AI request timeout | ≤15 seconds |
| Leads older than 90 days | Auto-cleaned |
| Lightbox Escape key | Works |
| Mobile menu focus trap | Works |
