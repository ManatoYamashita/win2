# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WIN×Ⅱ is an affiliate blog site built on Wix, integrating Google Sheets for data management and tracking. The system supports three user roles (Admin, Member, Agent) and tracks affiliate conversions with automatic cashback calculation.

**Key Architecture**: Wix Velo (frontend + backend) ↔ Google Sheets API ↔ Google Apps Script (GAS)

## Directory Structure

```
/Users/manatoy_mba/Desktop/dev/win2/
├─ gas/
│   └─ code.gs           # GAS script for CSV processing & cashback calculation
├─ wix-velo/
│   ├─ backend/
│   │   ├─ event.js      # Wix event handlers
│   │   └─ gSheetsLogger.jsw  # Google Sheets logging utility
│   └─ frontend/
│       └─ 案件一覧.js   # Affiliate deals list page with guest support
├─ README.md             # Setup & deployment guide
├─ win2-project.md       # Full requirements specification
└─ todo.md               # Current task tracking
```

## Core Architecture

### 1. Tracking Flow (Member & Guest)

**Frontend (案件一覧.js)**:
- Checks login status via `wix-members-frontend`
- Logged in: Use `memberId`
- Guest: Generate `guest:<UUID>` and persist in localStorage
- On deal click: `logClick({ memberId, dealName })` → Google Sheets
- Redirect to ASP with `?id1=<memberId|guest:UUID>`

**Backend (gSheetsLogger.jsw)**:
- `logClick()`: Appends [timestamp, memberId, dealName] to "クリックログ" sheet
- Uses Wix Secrets: `G_SHEETS_ID` for sheet identification
- Important: `appendValues()` accepts **1-dimensional array** (not nested)

### 2. CSV Processing & Cashback Calculation (GAS)

**File**: `gas/code.gs`

**Sheets**:
- `成果CSV_RAW`: Paste ASP CSV (with headers)
- `成果データ`: Output sheet (auto-formatted)
- `会員リスト`: Member master (memberId → name)
- `クリックログ`: Click log (A:C = timestamp, memberId, dealName)

**Key Logic** (gas/code.gs:178-195):
```javascript
// Guest detection
const isGuest = /^guest:/i.test(memberIdRaw);

// Cashback calculation
const cashback = isGuest ? 0 : applyRounding_(rawCashback, cfg.ROUNDING_MODE);

// Display name
const displayName = isGuest ? '非会員' : (memberMap.get(memberIdRaw) || memberIdRaw);
```

**Configuration** (Script Properties):
- `CASHBACK_RATE`: Default 0.20 (20%)
- `ONLY_PAY_ON_APPROVED`: Default true
- `ROUNDING_MODE`: "FLOOR" | "ROUND" | "CEIL" (default: FLOOR)

**Menu**: "成果処理" > "CSV取込→集計" or auto-run via trigger (03:10 daily)

### 3. Guest Application Feature (Added 2025-10-12)

**Design Principles**:
- No login required for deal applications
- Guest ID format: `guest:<UUID>` (RFC 4122-like, 32 hex digits)
- Persistent storage: Browser localStorage (key: `win2.guestId`)
- Cashback: 0 yen for guests, 20% for members
- Output display: "非会員" (non-member) for guests

**Implementation**:
- Frontend: 案件一覧.js:16-24 (`getOrCreateGuestId()`)
- Backend: gas/code.gs:182-195 (guest detection & cashback logic)

**Future Extension**: Guest-to-member conversion via invitation code or email matching

## Development Commands

### GAS Deployment

**Option A** (Manual):
1. Open Google Apps Script editor
2. Copy `gas/code.gs` content
3. Paste and save

**Option B** (clasp):
```bash
npm install -g @google/clasp
clasp login
clasp create --type sheets --title "win2-gas"
clasp push
```

### Wix Velo Deployment

1. Open Wix Editor (or Wix Studio)
2. Navigate to Code Panel
3. Backend: Copy `wix-velo/backend/*.jsw` to Backend modules
4. Frontend: Copy `wix-velo/frontend/*.js` to respective page code
5. Publish site

### Testing GAS Locally

```javascript
// In Apps Script editor, run:
runImportAndAggregate()

// Or via menu:
// "成果処理" > "CSV取込→集計"
```

### Setting Up Trigger (Auto-run)

```javascript
// In Apps Script editor, run once:
setupTrigger()
// This sets daily execution at 03:10 JST
```

## Important Configuration

### Wix Secrets (Backend)

```javascript
// Required secrets in Wix Secrets Manager:
- G_SHEETS_ID: Google Sheets ID (from URL)
- velo-spreadsheet-credentials: GCP Service Account JSON
```

### Google Sheets Setup

1. Create Google Sheets with tabs:
   - `成果CSV_RAW`
   - `成果データ`
   - `会員リスト`
   - `クリックログ` (A:C = timestamp, memberId, dealName)

2. Share sheet with service account's `client_email` (Editor role)

3. Add sheet ID to Wix Secrets as `G_SHEETS_ID`

### ASP Integration

**Tracking Parameter**: `id1` (default)
- Format: `?id1=<memberId>` or `?id1=guest:<UUID>`
- Future: `paramKey` support for ASP-specific parameters (e.g., `s1`, `sub_id`)

**CSV Headers** (gas/code.gs:30-35):
```javascript
HEADER_CANDIDATES = {
  memberId: ['id1', 'memberid', 'member_id', '会員id', ...],
  reward:   ['reward', '成果報酬', '報酬額', ...],
  status:   ['status', '承認状況', 'ステータス', ...],
  dealName: ['dealname', '案件名', '商品名', ...]
}
```

## Code Conventions

### GAS (Apps Script)

- **Naming**: Trailing underscore for private functions (e.g., `safeCell_()`)
- **Constants**: UPPER_SNAKE_CASE for sheet names and config keys
- **Error handling**: Throw descriptive errors with context
- **Batch processing**: Use `BATCH_SIZE` (default 300) to avoid timeouts
- **Logging**: Use `console.log(JSON.stringify({...}))` for structured logs

### Wix Velo

- **Backend (.jsw)**: Must export functions used by frontend
- **Frontend**: Use `$w.onReady()` for initialization
- **Imports**: `wix-*` modules for Wix APIs, `backend/*` for custom modules
- **Error handling**: Try-catch with fallback to ensure page functionality
- **Member check**: Always handle both logged-in and guest states

### Commit Message Prefixes

- `FEATURE`: New functionality
- `FIX`: Bug fixes
- `REFACTORING`: Code restructuring
- `DOC`: Documentation updates
- `STYLE`: Code style changes (formatting, etc.)

## Common Pitfalls

1. **Spreadsheet Permissions**: Ensure service account has Editor access
2. **Wix Secrets**: Backend only - never access from frontend
3. **GAS Triggers**: Re-create after script edits (run `setupTrigger()` again)
4. **AppendValues Format**: Must be 1-dimensional array, not nested
5. **Guest ID Persistence**: Uses localStorage (not sessionStorage)
6. **CSV Headers**: Add ASP-specific headers to `HEADER_CANDIDATES` if needed

## Testing Checklist

### Guest Application Flow

1. **Logout** from Wix site
2. **Click deal** on affiliate list page
3. **Check console**: `[click] { idForTracking: "guest:...", ... }`
4. **Check "クリックログ"**: Row with `guest:<UUID>` in column B
5. **Restart browser** and click another deal
6. **Verify**: Same `guest:<UUID>` is used (persistence check)
7. **Login** as member and click deal
8. **Verify**: Column B now shows `memberId` (not `guest:`)

### CSV Processing

1. **Paste test CSV** to "成果CSV_RAW":
   ```
   id1,成果報酬,承認状況,案件名
   guest:test-uuid-...,1000,承認,Test Deal A
   <real-member-id>,5000,承認,Test Deal B
   ```
2. **Run** "成果処理" > "CSV取込→集計"
3. **Check "成果データ"**:
   - Row 1: 氏名=非会員, キャッシュバック金額=0, memberId(参考)=guest:...
   - Row 2: 氏名=<member-name>, キャッシュバック金額=1000, memberId(参考)=<member-id>

## Key Files Reference

- **Guest detection**: gas/code.gs:182
- **Cashback calculation**: gas/code.gs:187
- **Guest ID generation**: 案件一覧.js:16-24
- **Click logging**: gSheetsLogger.jsw:36-48
- **Configuration UI**: gas/code.gs:79-113
- **Full requirements**: win2-project.md
- **Current tasks**: todo.md
