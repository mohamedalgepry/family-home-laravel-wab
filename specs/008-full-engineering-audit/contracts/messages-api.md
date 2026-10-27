# Contract: Messages Endpoints & Lifecycle

## 1. Public Submission Endpoint

### `POST /units/{unit:slug}/contact` or `POST /contact`

Submits an inquiry from a prospective client.

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: {csrf_token}
```

#### Request Body
```json
{
  "client_name": "Karim Farouk",
  "client_phone": "+201012345678",
  "client_email": "karim@example.com",
  "content": "I would like to schedule a viewing for this property next Sunday.",
  "unit_id": 42
}
```

#### Validation Rules
- `client_name`: string, required, min: 2, max: 100
- `client_phone`: string, required_without: client_email, nullable, max: 20
- `client_email`: email, required_without: client_phone, nullable, max: 255
- `content`: string, required, min: 5, max: 2000
- `unit_id`: integer, nullable, exists:units,id

#### Response (Success)
- **Status Code**: `302 Redirect` (for Inertia submissions) with flash message:
  ```json
  {
    "flash": {
      "success": "تم إرسال رسالتك بنجاح وسيتواصل معك المسؤول قريباً."
    }
  }
  ```
- **Async Execution**:
  - `Message` is committed to MySQL immediately inside `DB::transaction()`.
  - `NewMessageNotification` implements `ShouldQueue` and is dispatched to queue worker.
  - SMTP delivery occurs asynchronously in background.

---

## 2. Admin Management Endpoints

### `GET /admin/messages`
Renders the messages inbox via Inertia with role-scoped data and preserved query filters.

#### Query Parameters
- `status`: string, optional (`pending` | `replied`)
- `agent_id`: integer, optional (filtered by agent ID)
- `page`: integer, optional (page index, default 1)

#### Inertia Props Contract
```typescript
interface AdminMessagesIndexProps {
  messages: {
    data: MessageItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
  agents: { id: number; name: string }[];
  filters: {
    status: string;
    agent_id: string | number;
  };
}

interface MessageItem {
  id: number;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  content: string;
  status: 'pending' | 'replied';
  replied_at: string | null;
  created_at: string;
  unit?: {
    id: number;
    name: string;
  } | null;
  agent?: {
    id: number;
    name: string;
  } | null;
}
```

---

### `POST /admin/messages/{message}/replied`
Marks a message inquiry as replied.

#### Authorization
- Verified via `MessagePolicy::update($user, $message)`.
- `admin`: Can mark any message as replied.
- `manager`: Can mark messages assigned to managed agents.
- `agent`: Can mark messages assigned to self (`agent_id === user.id`).

#### Response
```json
{
  "success": true
}
```

---

### `DELETE /admin/messages/{message}`
Deletes an inquiry record permanently.

#### Authorization
- Verified via `MessagePolicy::delete($user, $message)`.
- Restricted to `admin` role only.

#### Response
- `302 Redirect` back to `/admin/messages` with flash notification.

---

### `GET /admin/messages/unread-count`
Polling endpoint for the admin top navigation unread badge.

#### Response Headers
```http
Content-Type: application/json
Cache-Control: private, no-cache, no-store, must-revalidate
```

#### Response Body
```json
{
  "count": 4
}
```
*Note*: Logs exceptions to Laravel logger instead of silently returning `{count: 0}` on failure.
