# Webhook Flow Architecture - ASP Conversion Tracking

**Last Updated:** 2025-01-03

## Overview

This document outlines the technical architecture for receiving real-time conversion notifications from ASPs (Affiliate Service Providers) via webhooks and processing them to update conversion data in Google Sheets.

## System Architecture Diagram

```
┌──────────────┐
│  User clicks │
│  CTA button  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│  /api/track-click                   │
│  - Generate eventId (UUID v4)       │
│  - Log to Google Sheets "クリックログ" │
│  - Return tracking URL with id1     │
└──────┬──────────────────────────────┘
       │
       ▼
┌────────────────────────────┐
│  ASP (A8.net, afb, etc.)   │
│  - User completes action   │
│  - Conversion occurs        │
└──────┬─────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  ASP Webhook                          │
│  POST /api/webhooks/asp-conversion    │
│  - Payload: {                         │
│      tracking_id,                     │
│      event_id,                        │
│      amount,                          │
│      status,                          │
│      ...                              │
│    }                                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Webhook Handler                      │
│  1. Validate signature                │
│  2. Parse payload (ASP-specific)      │
│  3. Match eventId with click log      │
│  5. Write to Google Sheets            │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Google Sheets "成果データ"            │
│  - Member name                        │
│  - Deal name                          │
│  - Status                             │
│  - Timestamp                          │
└───────────────────────────────────────┘
```

---

## Current System (Manual CSV Process)

### Existing Flow

```
1. User clicks CTA → /api/track-click logs click (eventId, memberId)
2. Conversion occurs on ASP
3. [MANUAL] Download CSV from ASP dashboard
4. [MANUAL] Paste into Google Sheets "成果CSV_RAW"
5. [AUTO] GAS runs daily at 3:10 AM
6. [AUTO] GAS processes data and outputs to "成果データ"
```

### Pain Points

- Manual CSV download and paste required
- 24-hour delay (GAS runs once daily)
- No real-time conversion visibility
- Manual work prone to errors

---

## Proposed System (Webhook-based)

### New Flow

```
1. User clicks CTA → /api/track-click logs click (eventId, memberId)
2. Conversion occurs on ASP
3. [AUTO] ASP sends webhook to /api/webhooks/asp-conversion
4. [AUTO] Webhook handler validates, processes, and writes to Sheets
5. [AUTO] Conversion data immediately available in dashboard
```

### Benefits

- **Real-time**: Conversions visible immediately
- **Automated**: No manual CSV processing
- **Reliable**: Webhook delivery with retry mechanism
- **Scalable**: Handles multiple ASPs uniformly

---

## Webhook Endpoint Specification

### Endpoint

```
POST /api/webhooks/asp-conversion
```

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `asp` | Yes | ASP identifier (`a8net`, `afb`, `moshimo`, `valuecommerce`) |
| `type` | No | Event type (`conversion`, `status_update`) - Default: `conversion` |

**Example:**
```
POST /api/webhooks/asp-conversion?asp=afb&type=conversion
```

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `application/json` or `application/x-www-form-urlencoded` |
| `X-ASP-Signature` | Yes (afb, a8net) | HMAC-SHA256 signature for verification |
| `X-ASP-Timestamp` | Recommended | Unix timestamp to prevent replay attacks |
| `User-Agent` | No | ASP identifier (e.g., `AFB-Webhook/1.0`) |

### Request Body (Expected Payload)

**JSON Format (Standardized):**

```json
{
  "tracking_id": "member123",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "program_id": "PRG12345",
  "program_name": "Example Program",
  "order_id": "ORD-2025-001",
  "amount": 1000.00,
  "currency": "JPY",
  "status": "pending",
  "timestamp": "2025-01-03T12:00:00Z",
  "asp_specific": {
    // ASP-specific additional fields
  }
}
```

**Field Definitions:**

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `tracking_id` | string | Member ID or guest:UUID from `id1` parameter | ✅ Yes |
| `event_id` | string | UUID v4 event identifier | ✅ Yes |
| `program_id` | string | ASP's program/deal identifier | ✅ Yes |
| `program_name` | string | Human-readable program name | No |
| `order_id` | string | Order/transaction identifier | No |
| `currency` | string | Currency code (default: JPY) | No |
| `status` | string | `pending`, `approved`, `cancelled`, `rejected` | ✅ Yes |
| `timestamp` | string | ISO 8601 timestamp | ✅ Yes |
| `asp_specific` | object | ASP-specific additional data | No |

### Response

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Conversion processed successfully",
  "conversion_id": "CONV-2025-001"
}
```

**Validation Error (400 Bad Request):**

```json
{
  "status": "error",
  "message": "Invalid signature",
  "code": "INVALID_SIGNATURE"
}
```

**Server Error (500 Internal Server Error):**

```json
{
  "status": "error",
  "message": "Failed to write to Google Sheets",
  "code": "INTERNAL_ERROR"
}
```

---

## Webhook Handler Implementation

### File: `app/api/webhooks/asp-conversion/route.ts`

### Processing Flow

```typescript
export async function POST(request: Request) {
  try {
    // 1. Parse query parameters
    const { searchParams } = new URL(request.url);
    const asp = searchParams.get('asp');
    const type = searchParams.get('type') || 'conversion';

    // 2. Validate ASP parameter
    if (!asp || !['a8net', 'afb', 'moshimo', 'valuecommerce'].includes(asp)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid ASP', code: 'INVALID_ASP' },
        { status: 400 }
      );
    }

    // 3. Verify webhook signature
    const signature = request.headers.get('X-ASP-Signature');
    const body = await request.text();

    if (!verifyWebhookSignature(asp, signature, body)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid signature', code: 'INVALID_SIGNATURE' },
        { status: 401 }
      );
    }

    // 4. Parse webhook payload (ASP-specific)
    const payload = parseWebhookPayload(asp, body);

    // 5. Validate payload
    const validatedPayload = webhookSchema.parse(payload);

    // 6. Match eventId with click log
    const clickLog = await matchEventIdWithClickLog(validatedPayload.event_id);

    if (!clickLog) {
      // Log for debugging but don't fail (may be old conversion)
      console.warn(`No click log found for eventId: ${validatedPayload.event_id}`);
    }

    // 7. Check for duplicate conversion
    if (await isDuplicateConversion(validatedPayload.event_id, validatedPayload.order_id)) {
      return NextResponse.json(
        { status: 'success', message: 'Duplicate conversion ignored' },
        { status: 200 }
      );
    }

      validatedPayload.amount,
      validatedPayload.tracking_id,
      validatedPayload.status
    );

    // 9. Write to Google Sheets "成果データ"
    const conversionId = await writeConversionData({
      memberId: validatedPayload.tracking_id,
      memberName: clickLog?.memberName || '非会員',
      dealName: validatedPayload.program_name || clickLog?.dealName || '不明',
      status: validatedPayload.status,
      eventId: validatedPayload.event_id,
      originalAmount: validatedPayload.amount,
      orderId: validatedPayload.order_id,
      timestamp: validatedPayload.timestamp,
    });

    // 10. Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Conversion processed successfully',
      conversion_id: conversionId,
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Internal error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
```

---

## Signature Verification

### Purpose

Verify that webhook requests are genuinely from the ASP and haven't been tampered with.

### Implementation

**File: `lib/webhooks/verify-signature.ts`**

```typescript
import crypto from 'crypto';

export function verifyWebhookSignature(
  asp: string,
  signature: string | null,
  payload: string
): boolean {
  if (!signature) {
    return false;
  }

  // Get ASP-specific webhook secret from environment
  const secret = getWebhookSecret(asp);
  if (!secret) {
    throw new Error(`Webhook secret not configured for ASP: ${asp}`);
  }

  // Calculate expected signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Compare signatures (timing-safe comparison)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

function getWebhookSecret(asp: string): string | undefined {
  const secrets: Record<string, string | undefined> = {
    a8net: process.env.ASP_A8NET_WEBHOOK_SECRET,
    afb: process.env.ASP_AFB_WEBHOOK_SECRET,
    moshimo: process.env.ASP_MOSHIMO_WEBHOOK_SECRET,
    valuecommerce: process.env.ASP_VALUECOMMERCE_WEBHOOK_SECRET,
  };

  return secrets[asp];
}
```

### Environment Variables

```bash
# .env.local
ASP_A8NET_WEBHOOK_SECRET=your_a8net_webhook_secret_here
ASP_AFB_WEBHOOK_SECRET=your_afb_webhook_secret_here
ASP_MOSHIMO_WEBHOOK_SECRET=your_moshimo_webhook_secret_here
ASP_VALUECOMMERCE_WEBHOOK_SECRET=your_valuecommerce_webhook_secret_here
```

---

## EventId Matching Logic

### Purpose

Match webhook conversion data with the original click log entry to retrieve member and deal information.

### Implementation

**File: `lib/webhooks/match-event.ts`**

```typescript
import { readClickLogs } from '@/lib/sheets';

export interface ClickLogEntry {
  timestamp: string;
  memberId: string;
  memberName?: string;
  dealName: string;
  dealId: string;
  eventId: string;
}

export async function matchEventIdWithClickLog(
  eventId: string
): Promise<ClickLogEntry | null> {
  try {
    // Read click logs from Google Sheets
    const clickLogs = await readClickLogs();

    // Find matching entry by eventId (column E)
    const matchedLog = clickLogs.find(log => log.eventId === eventId);

    if (!matchedLog) {
      return null;
    }

    // Optionally fetch member name from 会員リスト if not cached
    if (!matchedLog.memberName && !matchedLog.memberId.startsWith('guest:')) {
      const memberInfo = await getMemberInfo(matchedLog.memberId);
      matchedLog.memberName = memberInfo?.name || '不明';
    }

    return matchedLog;

  } catch (error) {
    console.error('Error matching eventId:', error);
    return null;
  }
}

async function getMemberInfo(memberId: string): Promise<{ name: string } | null> {
  // Implementation in lib/sheets.ts
  // Read from "会員リスト" sheet, column A (memberId), column B (氏名)
  return null; // Placeholder
}
```

### Google Sheets Reference

**クリックログ (Click Log) Structure:**

| Column | Field | Description |
|--------|-------|-------------|
| A | 日時 | Timestamp (ISO 8601) |
| B | memberId | Member ID or guest:UUID |
| C | 案件名 | Deal name |
| D | 案件ID | Deal ID |
| E | イベントID | Event ID (UUID v4) |

---


### Rules

3. **Status-Based Payment:**
   - `pending`: Log but don't pay

### Implementation


```typescript
export const ONLY_PAY_ON_APPROVED = true;
export const ROUNDING_MODE = 'FLOOR'; // 'FLOOR', 'CEIL', 'ROUND'

  amount: number,
  trackingId: string,
  status: string
): number {
  if (trackingId.startsWith('guest:')) {
    return 0;
  }

  // Only pay on approved conversions
  if (ONLY_PAY_ON_APPROVED && status !== 'approved') {
    return 0;
  }


  // Apply rounding
  switch (ROUNDING_MODE) {
    case 'FLOOR':
    case 'CEIL':
    case 'ROUND':
    default:
  }
}
```

### Examples

```typescript
// Example 1: Member, approved, 5000 yen commission
// → 1000 (floor(5000 × 0.20))

// Example 2: Member, pending, 5000 yen commission
// → 0 (only pay on approved)

// Example 3: Guest, approved, 5000 yen commission

// Example 4: Member, approved, 5555 yen commission
// → 1111 (floor(5555 × 0.20))
```

---

## Google Sheets Integration

### Write Conversion Data

**File: `lib/sheets.ts` (new function)**

```typescript
export async function writeConversionData(data: {
  memberId: string;
  memberName: string;
  dealName: string;
  status: string;
  eventId: string;
  originalAmount: number;
  orderId?: string;
  timestamp: string;
}): Promise<string> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

    // Sheet name: 成果データ
    const sheetName = '成果データ';

    // Generate conversion ID
    const conversionId = `CONV-${Date.now()}`;

    // Prepare row data
    const row = [
      data.memberName,           // A: 氏名
      data.dealName,             // B: 案件名
      data.status,               // C: 承認状況
      data.memberId,             // E: memberId（参考）
      data.eventId,              // F: イベントID（参考）
      data.originalAmount,       // G: 原始報酬額（参考）
      data.orderId || '',        // H: 注文ID（参考）
      data.timestamp,            // I: タイムスタンプ
      conversionId,              // J: 変換ID（内部管理用）
    ];

    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:J`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log(`Conversion written to Sheets: ${conversionId}`);
    return conversionId;

  } catch (error) {
    console.error('Error writing conversion data:', error);
    throw new Error('Failed to write conversion data to Google Sheets');
  }
}
```

### Google Sheets Structure Update

**成果データ (Conversion Data) - New Structure:**

| Column | Field | Description |
|--------|-------|-------------|
| A | 氏名 | Member name (or "非会員" for guests) |
| B | 案件名 | Deal/program name |
| C | 承認状況 | Status (`pending`, `approved`, `cancelled`, `rejected`) |
| E | memberId（参考） | Member ID or guest:UUID |
| F | イベントID（参考） | Event ID (UUID v4) |
| G | 原始報酬額（参考） | Original commission amount |
| H | 注文ID（参考） | Order/transaction ID |
| I | タイムスタンプ | ISO 8601 timestamp |
| J | 変換ID（内部管理用） | Internal conversion ID |

---

## Duplicate Detection

### Purpose

Prevent duplicate processing of the same conversion (e.g., if ASP sends the same webhook twice).

### Implementation

**File: `lib/webhooks/duplicate-detection.ts`**

```typescript
import { getSheetsClient } from '@/lib/googleapis';

export async function isDuplicateConversion(
  eventId: string,
  orderId?: string
): Promise<boolean> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

    // Read existing conversions from "成果データ"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: '成果データ!F:H', // Columns: eventId, originalAmount, orderId
    });

    const rows = response.data.values || [];

    // Check if eventId already exists (column F)
    const existingConversion = rows.find(row => {
      const existingEventId = row[0]; // Column F
      const existingOrderId = row[2]; // Column H

      // Match by eventId (primary)
      if (existingEventId === eventId) {
        return true;
      }

      // Match by orderId if provided (secondary)
      if (orderId && existingOrderId === orderId) {
        return true;
      }

      return false;
    });

    return !!existingConversion;

  } catch (error) {
    console.error('Error checking for duplicates:', error);
    // Fail-safe: allow processing if duplicate check fails
    return false;
  }
}
```

---

## Error Handling & Retry Logic

### ASP Webhook Retry Behavior

Most ASPs implement automatic retry with exponential backoff:

1. Initial request
2. If fails (non-200 status), retry after 1 minute
3. Retry after 5 minutes
4. Retry after 15 minutes
5. Retry after 1 hour
6. Give up after 24 hours

### Our Response Strategy

**Always return appropriate HTTP status codes:**

| Scenario | Status Code | Action |
|----------|-------------|--------|
| Success | 200 OK | Conversion processed, don't retry |
| Validation error | 400 Bad Request | Invalid data, don't retry |
| Authentication error | 401 Unauthorized | Invalid signature, don't retry |
| Duplicate | 200 OK | Already processed, don't retry |
| Temporary error | 500 Internal Server Error | Retry later |
| Rate limit | 429 Too Many Requests | Retry later |

### Implementation

```typescript
try {
  // Process webhook
  return NextResponse.json({ status: 'success' }, { status: 200 });
} catch (error) {
  if (error instanceof ZodError) {
    // Validation error - don't retry
    return NextResponse.json(
      { status: 'error', code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  if (error.message.includes('signature')) {
    // Auth error - don't retry
    return NextResponse.json(
      { status: 'error', code: 'AUTH_ERROR' },
      { status: 401 }
    );
  }

  // Unknown error - allow retry
  return NextResponse.json(
    { status: 'error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}
```

---

## Logging & Monitoring

### Webhook Request Logging

**Purpose:** Debug webhook issues and monitor ASP traffic

**Implementation:**

```typescript
// Log all webhook requests
console.log('[Webhook] Received request', {
  asp,
  type,
  timestamp: new Date().toISOString(),
  eventId: payload.event_id,
  status: payload.status,
  amount: payload.amount,
});

// Log successful processing
console.log('[Webhook] Successfully processed', {
  eventId: payload.event_id,
  conversionId,
});

// Log errors
console.error('[Webhook] Processing error', {
  eventId: payload.event_id,
  error: error.message,
  stack: error.stack,
});
```

### Monitoring Metrics

Track these metrics for operational monitoring:

1. **Webhook Request Rate**
   - Requests per hour/day
   - By ASP

2. **Processing Success Rate**
   - Successful vs. failed requests
   - Error types distribution

3. **Average Processing Time**
   - Time from webhook receipt to Sheets write

4. **Duplicate Rate**
   - How often duplicates are detected

5. **Unmatched eventId Rate**
   - Conversions without corresponding click log

---

## Testing Strategy

### Local Development Testing

**Tools:**
- ngrok or localtunnel for exposing local endpoint
- Postman or curl for simulating webhook requests

**Setup:**

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start ngrok tunnel
ngrok http 3000

# Copy ngrok URL (e.g., https://abc123.ngrok.io)
# Configure in ASP dashboard:
# https://abc123.ngrok.io/api/webhooks/asp-conversion?asp=afb
```

**Test Webhook Request:**

```bash
# Test afb webhook
curl -X POST "http://localhost:3000/api/webhooks/asp-conversion?asp=afb" \
  -H "Content-Type: application/json" \
  -H "X-ASP-Signature: test_signature" \
  -d '{
    "tracking_id": "member123",
    "event_id": "550e8400-e29b-41d4-a716-446655440000",
    "program_id": "TEST001",
    "program_name": "Test Program",
    "amount": 5000,
    "status": "approved",
    "timestamp": "2025-01-03T12:00:00Z"
  }'
```

### Production Testing

1. **Test Mode (if supported by ASP)**
   - Some ASPs provide test webhook functionality
   - Sends sample payload to configured URL

2. **Real Conversion Testing**
   - Perform small test conversion on ASP
   - Monitor webhook arrival and processing
   - Verify data in Google Sheets

3. **Error Scenario Testing**
   - Invalid signature
   - Duplicate conversion
   - Missing fields
   - Network timeout

---

## Migration Strategy

### Phase 1: Parallel Operation (Recommended)

Run both systems simultaneously:

1. Keep existing GAS processing active
2. Deploy webhook endpoint
3. Configure ASP webhooks
4. Monitor webhook processing for 2 weeks
5. Compare webhook data with GAS-processed data
6. Identify and fix any discrepancies

### Phase 2: Gradual Cutover

1. **Week 1-2:** Webhook only for afb (most reliable)
2. **Week 3-4:** Add A8.net if webhook available
3. **Week 5+:** Expand to remaining ASPs

### Phase 3: GAS Deprecation

Once confident in webhook stability:

1. Update GAS to detect webhook-processed conversions (check for conversion ID)
2. GAS skips already-processed entries
3. Eventually disable GAS completely

### Rollback Plan

If webhook system fails:

1. Immediately revert to manual CSV process
2. GAS continues processing as before
3. Investigate and fix webhook issues
4. Re-test before re-enabling

---

## Security Checklist

- [ ] Webhook signature verification implemented
- [ ] HTTPS enforced for all webhook endpoints
- [ ] Rate limiting configured (prevent DoS)
- [ ] Input validation with Zod schemas
- [ ] Duplicate detection prevents double-processing
- [ ] Sensitive data (API keys, secrets) in environment variables
- [ ] Error messages don't expose internal details
- [ ] Logging doesn't include PII (Personally Identifiable Information)
- [ ] Webhook secrets rotated periodically
- [ ] IP whitelist configured (if supported by ASP)

---

## Performance Considerations

### Expected Load

- **Peak Traffic:** 10-50 conversions per hour
- **Average Response Time Target:** < 2 seconds
- **Google Sheets API Quota:** 100 requests per 100 seconds per user

### Optimization Strategies

1. **Batch Writes (if high volume):**
   - Queue conversions in memory
   - Write to Sheets in batches every 30 seconds
   - Trade-off: slight delay for better performance

2. **Caching:**
   - Cache member data to reduce Sheets reads
   - Use Redis or in-memory cache
   - TTL: 5 minutes

3. **Async Processing:**
   - Return 200 OK immediately
   - Process webhook in background job
   - Use Vercel background functions or queue

### Current Implementation

Start with **synchronous processing** (simpler):
- Webhook → Validate → Process → Write → Respond

If performance issues arise, implement async processing.

---

## Next Steps

### Immediate Actions

1. **afb API Documentation**
   - [ ] Login to afb dashboard
   - [ ] Download webhook/postback specification
   - [ ] Obtain webhook secret and API keys
   - [ ] Test webhook payload format

2. **Implementation**
   - [ ] Create Zod validation schemas
   - [ ] Implement webhook endpoint
   - [ ] Implement signature verification
   - [ ] Implement eventId matching logic
   - [ ] Implement Google Sheets write function

3. **Testing**
   - [ ] Unit tests for calculation logic
   - [ ] Integration tests for webhook flow
   - [ ] Local testing with ngrok
   - [ ] Production test with real conversion

4. **Deployment**
   - [ ] Deploy to Vercel
   - [ ] Configure ASP webhook URLs
   - [ ] Monitor initial webhook traffic
   - [ ] Validate data accuracy

---

## References

- [ASP API Integration Documentation](./asp-api-integration.md)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Webhook Best Practices](https://webhooks.fyi/)

---

**Document Status:** Design - Ready for Implementation

**Last Reviewed:** 2025-01-03