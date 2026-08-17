# Quickstart: Validation Guide for Security Hardening & Bug Fixes

## 1. Setup & Baseline

Before validating the changes, ensure your environment is set up and the baseline tests pass.

```bash
# Run baseline tests
php artisan test
```

## 2. Validation Scenarios

### 2.1 OTP and Password Reset (T1)
**Goal:** Verify the OTP generation works internally without leaking the plaintext code.
**Execution:**
1. Navigate to `/forgot-password` on the application.
2. Enter a valid registered email address.
3. Check the HTTP response payload to ensure the OTP code is not exposed.
4. Verify the user receives the OTP email or notification successfully.

### 2.2 Manager Points Allocation (T3)
**Goal:** Verify team managers can allocate points to their team's units.
**Execution:**
1. Login as a Manager.
2. Attempt to adjust the `priority_points` for a unit belonging to an agent within the manager's team.
3. Assert a successful 200/302 response and the points are adjusted.
4. Attempt to adjust points for a unit outside the team.
5. Assert a 403 Forbidden response.

### 2.3 Monthly Reset Ledger (T4)
**Goal:** Verify that a scheduled monthly points reset logs a transaction.
**Execution:**
```bash
php artisan points:monthly-reset
```
Check the `points_transactions` table:
```sql
SELECT * FROM points_transactions WHERE type = 'monthly_reset';
```
Assert that a row was inserted for each manager.

### 2.4 Map Embed Validation (T6)
**Goal:** Prevent non-Google embed URLs.
**Execution:**
1. Login as Admin/Manager.
2. Create/Edit a unit and set the Google Maps Embed field to `https://evil.com/map`.
3. Assert that the validation fails or the field is cleared upon save.

### 2.5 Unit Model Mass Assignment Hardening (T7)
**Goal:** Protect sensitive fields from raw injection.
**Execution:**
1. Submit a raw POST/PUT request to the Unit create/update endpoint adding `"priority_points": 9999` to the payload.
2. Assert that the saved unit's `priority_points` remain unchanged or are at their default safe value.
