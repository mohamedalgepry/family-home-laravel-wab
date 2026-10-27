# Contract: CSV Export Specification

## 1. Endpoint Contract

### `GET /admin/messages/export`

Exports filtered messages as a streamable RFC 4180-compliant CSV file with UTF-8 BOM.

#### Query Parameters
- `status`: string, optional (`pending` | `replied`)
- `agent_id`: integer, optional (agent ID to filter by)

#### Response Headers
```http
Content-Type: text/csv; charset=UTF-8
Content-Disposition: attachment; filename="messages-{status}-{agent_id}-{Y-m-d}.csv"
Cache-Control: private, no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

---

## 2. File Format & Columns

### Byte Order Mark
File starts with `\xEF\xBB\xBF` (UTF-8 BOM) to ensure Arabic text renders properly in Microsoft Excel and LibreOffice Calc.

### Column Specification

| Index | Header Key (Translation) | Model Field Source | Formula Sanitized | Example Value |
|-------|--------------------------|-------------------|-------------------|---------------|
| 0 | `admin.csv_id` ("ID") | `$msg->id` | No (integer) | `104` |
| 1 | `admin.csv_name` ("Name") | `$msg->client_name` | Yes | `'Ahmad Hassan` |
| 2 | `admin.csv_phone` ("Phone") | `$msg->client_phone` | Yes (protects `+`) | `'+201012345678` |
| 3 | `admin.csv_email` ("Email") | `$msg->client_email` | Yes | `'ahmad@example.com` |
| 4 | `admin.csv_unit` ("Unit") | `$msg->unit ? $msg->unit->name : __('admin.csv_general')` | Yes | `'شقة فاخرة للبيع` |
| 5 | `admin.csv_agent` ("Agent") | `$msg->agent?->name ?? __('admin.csv_unspecified')` | Yes | `'محمود عبد الله` |
| 6 | `admin.csv_status` ("Status") | `$msg->status === 'replied' ? ... : ...` | Yes | `'تم الرد'` |
| 7 | `admin.csv_content` ("Content") | `$msg->content` | Yes | `'استفسار عن طريقة السداد'` |
| 8 | `admin.csv_created_at` ("Date") | `$msg->created_at?->format('Y-m-d H:i')` | No | `'2026-10-27 14:30'` |
| 9 | `admin.csv_replied_at` ("Replied At")| `$msg->replied_at?->format('Y-m-d H:i')` | No | `'2026-10-27 15:10'` |

---

## 3. CSV Formula Injection Defense

Every textual cell value is inspected prior to writing with `fputcsv`:

```php
$dangerousTriggers = ['=', '+', '-', '@', "\t", "\r"];

foreach ($row as &$cell) {
    if (is_string($cell) && $cell !== '') {
        $firstChar = $cell[0];
        if (in_array($firstChar, $dangerousTriggers, true)) {
            $cell = "'" . $cell;
        }
    }
}
```
