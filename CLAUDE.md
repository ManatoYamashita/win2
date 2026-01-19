# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WIN×Ⅱ is a membership-based affiliate blog platform that tracks conversions for ASP (Affiliate Service Provider) deals. The system tracks conversions using unique member IDs (or guest UUIDs for non-members) for accurate performance reporting.

## Tech Stack

**Frontend & Backend:**
- Next.js 15.5.9 (App Router) - CVE-2025-55184/67779/55183 対応済み (2025-12-29)
- React 19.2.1
- TypeScript 5 (strict mode, noUncheckedIndexedAccess enabled)
- TailwindCSS v3.4.1 (v4 planned for future)
- shadcn/ui for UI components
- Next-Auth v4.24.11 (stable version, CredentialsProvider)

**Data Management:**
- microCMS v3.2.0: Blog posts and deal information
- Google Sheets API (googleapis v164.1.0): Member database and conversion tracking
- Existing Google Apps Script (GAS) runs daily at 3:10 AM for data aggregation

**External Integration:**
- Primary: A8.net
- Future: AFB, もしもアフィリエイト, バリューコマース

**Analytics & Tracking:**
- Google Tag Manager (GTM): Tag management and event tracking
- Google Analytics 4 (GA4): User behavior analytics
- Google Search Console (GSC): Search performance and sitemap management
- Custom event tracking: `sign_up` (member registration), `deal_click` (affiliate click)

**Key Dependencies:**
- bcryptjs v3.0.2 (password hashing, salt rounds: 10)
- zod v4.1.12 (validation)
- class-variance-authority v0.7.1 (component variants)
- Radix UI primitives (@radix-ui/react-slot, @radix-ui/react-label)
- @tailwindcss/typography (Markdown prose styling)
- react-markdown v10.1.0 + remark-gfm + rehype-raw (Markdown rendering)

**Deployment:**
- Vercel

## Code Navigation & File Structure

### Key Files by Function

**Authentication & Session Management:**
- `lib/auth.ts`: Next-Auth configuration (CredentialsProvider, session callbacks)
- `lib/tokens.ts`: JWT token generation for email verification & password reset
- `middleware.ts`: Route protection for /mypage/* and /deals/*
- `app/api/auth/[...nextauth]/route.ts`: Next-Auth API endpoints

**Member Management:**
- `app/api/register/route.ts`: Member registration API (writes to Google Sheets)
- `app/api/members/me/route.ts`: Fetch/update member info
- `lib/validations/auth.ts`: Zod schemas for registration/login
- `lib/sheets.ts`: Google Sheets operations (readMembers, writeMember, updateMember)

**Blog & Content:**
- `app/blog/page.tsx`: Blog listing with pagination
- `app/blog/[id]/page.tsx`: Blog detail with SEO/OGP metadata
- `components/blog/blog-card.tsx`: Blog preview card component
- `components/blog/blog-content.tsx`: Content renderer with CTA shortcode support
- `lib/microcms.ts`: microCMS client and helper functions
- `lib/blog-utils.ts`: Blog content utilities (excerpt generation, etc.)

**Tracking & Conversion:**
- `app/api/track-click/route.ts`: Critical endpoint for click logging & URL generation
- `components/deal/deal-cta-button.tsx`: CTA button with tracking integration
- `lib/guest-uuid.ts`: Guest UUID management for non-members
- `lib/validations/tracking.ts`: Tracking payload validation

**Email Communication:**
- `lib/email.ts`: Resend email client and template functions
- `app/api/verify-email/route.ts`: Email verification token validation
- `app/api/reset-password/route.ts`: Password reset token validation

**UI Components:**
- `components/ui/*`: shadcn/ui components (Button, Card, Form, Input, etc.)
- `components/providers/session-provider.tsx`: Next-Auth SessionProvider wrapper

**Analytics & Tracking:**
- `components/analytics/google-tag-manager.tsx`: GTM script injection components
- `lib/gtm.ts`: Type-safe GTM helper functions (trackSignUp, trackDealClick)
- `types/gtm.d.ts`: GTM event type definitions and window.dataLayer extension
- `docs/analytics/gtm-setup.md`: Complete GTM × GA4 × GSC setup guide

### Directory Patterns

```
app/
├── (auth routes: login, register, verify-email, reset-password)
├── blog/[id]/         # Dynamic blog detail pages
├── category/[id]/     # Category-filtered blog listings
├── mypage/           # Member-only dashboard
└── api/              # All API routes

lib/
├── validations/      # Zod validation schemas
├── googleapis.ts     # Google API authentication
├── sheets.ts         # Google Sheets CRUD operations
├── microcms.ts       # microCMS client
└── (other utilities)

types/
├── microcms.ts       # microCMS API type definitions
└── next-auth.d.ts    # Next-Auth type extensions
```

### Finding Code Patterns

- **API Routes**: Look in `app/api/*/route.ts` for all backend endpoints
- **Server Components**: Files in `app/` without "use client" directive
- **Client Components**: Components with "use client" directive (forms, interactive elements)
- **Type Definitions**: Check `types/` for shared types, and inline types for component props
- **Validation**: All Zod schemas are in `lib/validations/`

## Critical Architecture Concepts

### Member ID & Guest Tracking System

The system supports both authenticated members and anonymous users:

- **Members**: Assigned a UUID v4 as `memberId` upon registration
- **Non-members**: Generate `guest:UUID` on first deal click, stored in cookies
- **Tracking Parameter**: `id1` parameter is appended to affiliate URLs to track conversions
- **Data Flow**: ASP → CSV export → Google Sheets → GAS processing → Member dashboard

### Three-Layer Data Architecture

1. **microCMS Layer**: Content management (blogs, deals, categories)
2. **Google Sheets Layer**: Transactional data (members, click logs, conversions)
3. **Next.js API Layer**: Bridge between frontend, microCMS, and Google Sheets

### Conversion Tracking Flow

```
User clicks deal → /api/track-click logs click → Redirect to ASP with id1 parameter
→ Conversion occurs on ASP → Manual CSV export → Paste into "成果CSV_RAW" sheet
→ GAS runs daily at 3:10 → Matches id1 with memberId → Processes conversion data
→ Outputs to "成果データ" sheet → Member views in /mypage/history
```

**Important**: Both members and non-members (`guest:UUID`) conversions are tracked for reporting.

## Google Sheets Structure

The master spreadsheet contains 4 sheets:

1. **会員リスト** (Member List)
   - Columns: memberId, 氏名, メールアドレス, パスワード(hash), 生年月日, 郵便番号, 電話番号, 登録日時

2. **クリックログ** (Click Log)
   - Columns: 日時, memberId (or guest:UUID), 案件名, 案件ID

3. **成果CSV_RAW** (Raw Conversion CSV)
   - Manual paste area for ASP export data
   - Columns: id1, dealName, reward, status

4. **成果データ** (Processed Conversion Data)
   - GAS output with processed conversion records
   - Columns: 氏名, 案件名, 承認状況, 参考報酬額, memberId(参考), 原始報酬額(参考), メモ

## microCMS API Design

### API 1: blogs
- Contains: title, slug, content, thumbnail, category, relatedDeals, SEO fields
- Used for: Blog listing and detail pages

### API 2: deals
- Contains: dealId, dealName, aspName, description, rewardAmount, affiliateUrl
- Used for: Deal listing (member-only) and inline CTAs in blog posts
- **Key field**: `affiliateUrl` - template URL to which `?id1={memberId}&id2={eventId}&eventId={eventId}` is appended at runtime

### API 3: categories
- Shared by both blogs and deals for filtering

## Key API Routes (To Be Implemented)

```
POST /api/auth/[...nextauth]  - Next-Auth login/logout
POST /api/register            - Member registration (writes to Google Sheets)
GET  /api/members/me          - Fetch current member info
PUT  /api/members/me          - Update member info
GET  /api/history             - Fetch member's conversion history from Sheets
POST /api/track-click         - Log click + generate tracking URL with id1
```

## Authentication & Authorization

- **Public access**: Blog posts, homepage
- **Member-only**: /deals, /mypage, /mypage/history
- **Non-members can apply**: Yes, via guest:UUID tracking
- **Session duration**: 30 days (Next-Auth)

## Development Commands

### Essential Commands

```bash
# Development server with Turbopack (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking (TypeScript)
npx tsc --noEmit
```

**Note**: `npm run dev` uses Turbopack (`--turbo` flag) by default for faster HMR and build times.

### Common Development Workflows

```bash
# Pre-commit checks (run before committing)
npm run lint && npx tsc --noEmit

# Clean rebuild (if encountering cache issues)
rm -rf .next && npm run dev

# Check microCMS connection
# Visit: http://localhost:3000/api/test-microcms (if implemented)

# Check Google Sheets API
# Ensure GOOGLE_SHEETS_* env vars are set in .env.local

# Monitor API routes during development
# Check terminal output for API route logs
```

### Troubleshooting

```bash
# If TypeScript errors persist after pulling changes
rm -rf node_modules package-lock.json && npm install

# If environment variables not loading
# 1. Check .env.local exists and has correct format
# 2. Restart dev server (Ctrl+C, then npm run dev)
# 3. Verify no trailing spaces in .env.local values

# If Google Sheets API fails
# 1. Verify service account JSON is properly formatted (no extra quotes/newlines)
# 2. Check GOOGLE_SHEETS_PRIVATE_KEY has \n literals, not actual newlines
# 3. Confirm spreadsheet is shared with service account email

# If Next-Auth session issues
# 1. Clear browser cookies
# 2. Regenerate NEXTAUTH_SECRET: openssl rand -base64 32
# 3. Check NEXTAUTH_URL matches current environment
```

## Design Reference

- Design inspiration: liskul.com
- Color scheme: Orange-based (trust and credibility)
- Mobile-first responsive design
- Lighthouse target: 90+ on all metrics

## Security Considerations

- Passwords: bcrypt hashed (salt rounds: 10)
- Google Sheets API credentials: Store in environment variables
- Session cookies: HttpOnly, Secure attributes
- CSRF protection: Next-Auth built-in
- **Never commit**: .env files, API keys, credentials

## Important Implementation Notes

### Deal Application Flow (/api/track-click)

This is the most critical API endpoint:

1. Check authentication status (`getServerSession`)
2. Get/generate member identifier (memberId or guest:UUID)
3. Log click to Google Sheets "クリックログ"
4. Fetch deal details from microCMS
5. Append `?id1={memberId}&id2={eventId}&eventId={eventId}` to `affiliateUrl`
6. Return tracking URL for redirect

**Do not skip logging** - this is essential for conversion tracking.

### Google Sheets API Integration

- Use `google-auth-library` and `googleapis` packages
- Service account credentials required
- Batch writes recommended (avoid rate limits)
- Column matching uses flexible header detection (see GAS code.gs for reference)

### GAS Behavior (Read-Only Reference)

The existing GAS script:
- Runs daily at 3:10 AM JST
- Reads "成果CSV_RAW" sheet
- Matches id1 parameter with memberId
- Processes conversion data based on approval status
- Handles guest:UUID as "非会員" for tracking purposes
- Outputs to "成果データ" sheet

**Do not modify GAS** unless explicitly requested.

## Implementation Status

### Phase 1: 基盤構築 ✅ Completed (100%)
1. ✅ Environment setup (Next.js 15, TailwindCSS v3, TypeScript)
2. ✅ shadcn/ui initialization (Button, Input, Card, Label components)
3. ✅ microCMS SDK setup with complete type definitions (Blog, Deal, Category)
4. ✅ Google Sheets API authentication and utility functions
5. ✅ Basic layout components (Header, Footer in app/layout.tsx)
6. ✅ Environment variables configuration (.env.local, .env.example)
7. ✅ Next-Auth v4.24.11 setup with CredentialsProvider (v5互換性問題によりダウングレード)
8. ✅ Member registration API implementation (/api/register)
9. ✅ Login functionality and session management
10. ✅ /api/track-click implementation with proper id1 tracking
11. ✅ Member dashboard with conversion history (/mypage, /mypage/history)

### Phase 2: 認証・会員機能 ✅ Completed (Phase 2-1 only) - **Verified 2025-01-03**
1. ✅ Email verification system (Resend integration) - **Feature Flag Controlled**
   - Verification token generation with JWT
   - Email templates and sending
   - Token validation and email update in Google Sheets
   - **⚠️ DNS Restriction**: Wix DNS limits prevent full Resend integration (MX records restricted)
   - **Feature Flag**: `RESEND_VALID=false` (default) skips email verification, `true` enables full flow
   - **✅ Tested**: Member registration with email verification skip works correctly
   - See `docs/architecture/dns-infrastructure.md` for details
2. ✅ Password reset flow (forgot-password, reset-password pages) - **Feature Flag Controlled**
   - Password reset token generation
   - Email notification
   - Password update functionality
   - **⚠️ Currently Disabled**: Returns 503 error when `RESEND_VALID=false`
3. ✅ **Core Authentication Verified (2025-01-03)**
   - ✅ Member registration: Works without email verification (`emailVerified=true` immediately)
   - ✅ Login: Works normally with registered credentials
   - ✅ Logout: Session management functions correctly
4. ⏭️ Phase 2-2 Admin Dashboard - **Skipped** (not critical)
5. ⏭️ Phase 2-3 Advanced features - **Skipped** (not critical)

### Phase 3: ブログ機能 ✅ Completed (100%)
1. ✅ Blog components
   - BlogCard component (thumbnail, title, excerpt, category badges)
   - DealCTAButton component (tracking + redirect)
   - Pagination component (smart page numbering)
   - **BlogContent component v2.0.0** (Markdown/HTML auto-detection, state-driven rendering)
2. ✅ Blog pages
   - Blog listing page (/blog) with pagination
   - Blog detail page (/blog/[id]) with SEO/OGP
   - Category page (/category/[id]) with filtering
   - Homepage update with hero section and recent blogs
3. ✅ microCMS integration
   - Complete API setup (blogs, deals, categories)
   - Type definitions and SDK helpers
   - Documentation (docs/microcms-setup.md)
4. ✅ SEO optimization (2025-10-30)
   - **Comprehensive metadata**: All pages now have complete metadata, OGP, Twitter Card, JSON-LD structured data
   - **Homepage**: Server Component with Organization + WebSite schema (removed useScrollReveal hooks)
   - **Auth pages**: Separate layout.tsx files for client components (login, register) with WebPage schema
   - **Blog detail**: Article schema with dynamic metadata generation
   - **Blog list & Category**: CollectionPage schema with Twitter Card
   - **Root layout**: title.template, comprehensive OGP/Twitter Card/robots settings
   - **Documentation**: Complete SEO implementation guide (docs/seo-implementation.md)
5. ✅ CTA Shortcode Feature (Blog内CTAボタン)
   - **BlogContent component**: `[CTA:dealId]` shortcode detection and conversion to interactive buttons
   - **Markdown support**: react-markdown integration with remark-gfm and rehype-raw plugins
   - **Google Sheets integration**: Deal master column mapping fixes (A=affiliateUrl, B=dealId)
   - **GAS automation**: onEdit trigger for auto-filling deal name, ASP name, and default values
   - **Documentation**: Client guide (docs/guides/cta-shortcode-guide.md) and technical spec (docs/guides/cta-technical-guide.md)
   - **Click tracking**: Full integration with /api/track-click (id1 + eventId parameters)

### Phase 2-4: ASP成果ステータス自動反映 ✅ Complete (2025-11-15)

**Status**: ✅ Complete - AFB Automated Polling + A8.net Manual CSV Hybrid Workflow
**GitHub Issue**: #22 - A8.net Parameter Tracking Report CSV検証と運用フロー確立（完了）
**Implementation Period**: 2025-11-15 (1 day)

#### ✅ A8.net Parameter Tracking検証成功 (2025-11-15)

**Result**: ✅ **Parameter Tracking Report confirmed working with conversions**

1. ✅ **Parameter Tracking Report Access**
   - URL: `https://media-console.a8.net/report/parameter`
   - User successfully accessed report with parameter data
   - CSV export functionality confirmed working

2. ✅ **CSV File Analysis** (`parameter_20251101-20251115_20251115173805.csv`)
   - **パラメータ(ID1)**: memberId correctly recorded (`b91765a2-f57d-4c82-bd07-9e0436f560da`)
   - **ステータス名**: Status information available (未確定/確定/否認)
   - **発生報酬額**: Reward amount (280 yen per conversion)
   - **成果ID**: Conversion IDs (251115945017, 251115944381)
   - **その他**: Click date, conversion date, confirmation date, device info, referrer URL

3. ✅ **Key Finding from A8.net Support**
   - Parameter Tracking Report **only shows conversion data, not click data**
   - Previous 4-week testing failed because only clicks were generated (no conversions)
   - Feature IS available for Media Members (initial assessment was incorrect)

#### ✅ AFB自動ポーリング実装完了 (2025-11-15)

**Implementation**: GitHub Actions Scheduler + AFB API Polling

1. ✅ **Code Restoration**
   - `app/api/cron/sync-afb-conversions/route.ts` - Restored from commit b8e9b98~1 + CRON_SECRET authentication added
   - `lib/asp/afb-client.ts` - AFB API client
   - `lib/matching/conversion-matcher.ts` - Conversion matching logic
   - `types/afb-api.ts` - AFB API type definitions

2. ✅ **GitHub Actions Scheduler**
   - `.github/workflows/afb-sync.yml` - 10-minute cron schedule (`*/10 * * * *`)
   - CRON_SECRET authentication (Bearer token)
   - Automatic Google Sheets integration

3. ✅ **Security Implementation**
   - POST method with CRON_SECRET validation
   - 401 Unauthorized for invalid authentication
   - 500 Server Error if CRON_SECRET not configured

#### ✅ Hybrid Workflow Established

**AFB Cases (Fully Automated)**:
```
GitHub Actions (every 10 min) → AFB API Polling → Google Sheets「成果CSV_RAW」
→ GAS Auto-execution (daily 3:10 AM) → 「成果データ」Sheet → Member MyPage
```

**A8.net Cases (Manual CSV - Weekly)**:
```
Parameter Tracking Report CSV Download (5 min/week)
→ Google Sheets「成果CSV_RAW」Paste → GAS Execution
→ Click Log F/G Columns Auto-Update → 「成果データ」Sheet → Member MyPage
```

#### ✅ A8.net成果マッチング処理（クリックログ自動更新） (2025-11-15)

**Status**: ✅ Existing Implementation Confirmed (GAS v4.0.0)

**Processing Details**:
- Fetches conversion data from A8.net Parameter Tracking Report CSV
- Matches with Click Log using id1 (memberId) + id2 (eventId)
- Auto-updates Click Log sheet columns:
  - **F列 (申し込み案件名)**: Program name from A8.net
  - **G列 (ステータス)**: Status (未確定/成果確定/否認) from A8.net

**Technical Implementation**:
- **GAS Function**: `recordConversionsToClickLog()` (`google-spread-sheet/code.gs.js` v4.0.0)
- **Execution Method**: Menu「成果処理」→「成果をクリックログに記録」
- **Matching Logic**: Complete match on B列 (memberId) + E列 (eventId)
- **Header Detection**: `HEADER_CANDIDATES` supports A8.net-specific column names:
  - `パラメータ(ID1)` → memberId
  - `パラメータ(ID2)` → eventId
  - `プログラム名` → dealName
  - `ステータス名` → status

**Operational Flow** (Weekly, 5 minutes):
1. Download CSV from A8.net Parameter Tracking Report (`https://media-console.a8.net/report/parameter`)
2. Paste into Google Sheets「成果CSV_RAW」(include header row)
3. Execute GAS menu:「成果処理」→「成果をクリックログに記録」
4. Verify Click Log F/G columns auto-updated
5. Members can view conversion status in MyPage

**Operations Manual**: `docs/operations/a8-conversion-matching.md` - Complete step-by-step guide with troubleshooting

**Click Log Sheet Structure**:
```
A: 日時 | B: 会員ID (id1) | C: 案件名 | D: 案件ID | E: イベントID (id2)
| F: 申し込み案件名 (GAS更新) | G: STATUS (GAS更新)
```

**Matching Algorithm** (`code.gs.js` L128-147):
```javascript
// For each conversion in 成果CSV_RAW
for (const conversion of conversions) {
  const memberId = conversion.id1;
  const eventId = conversion.id2;

  // Search Click Log for matching row
  for (const clickLog of clickLogs) {
    if (clickLog.B === memberId && clickLog.E === eventId) {
      // Update F/G columns
      clickLog.F = conversion.dealName;  // A8.net プログラム名
      clickLog.G = conversion.status;    // A8.net ステータス名
      break;
    }
  }
}
```

#### 📝 Documentation Created

1. ✅ **Operations Manual**: `docs/operations/afb-a8-hybrid-workflow.md`
   - Complete hybrid workflow guide
   - AFB automated polling monitoring
   - A8.net manual CSV procedures (step-by-step with screenshots guidance)
   - Troubleshooting for both ASPs
   - Maintenance schedule

2. ✅ **GAS Update Guide**: `docs/operations/gas-a8net-update-guide.md`
   - A8.net-specific header candidates (パラメータ(ID1), ステータス名, 発生報酬額, プログラム名)
   - A8.net-specific status values (成果確定, 報酬確定, 支払済)
   - Status validation logic extension
   - Implementation steps and troubleshooting

3. ✅ **Environment Variables Setup**: `docs/operations/environment-variables-setup.md`
   - GitHub Secrets configuration (CRON_SECRET, APP_URL)
   - Vercel environment variables (CRON_SECRET, AFB_PARTNER_ID, AFB_API_KEY)
   - CRON_SECRET generation methods
   - Security best practices

4. ✅ **A8.net Conversion Matching Manual**: `docs/operations/a8-conversion-matching.md`
   - Phase 1: Initial operation verification test (step-by-step guide)
   - Daily operational flow (weekly CSV download routine)
   - Troubleshooting guide (5 common issues with solutions)
   - Technical specifications (GAS matching algorithm, header detection logic)
   - Click Log F/G column auto-update mechanism
   - Complete FAQ section

5. ✅ **Configuration Updates**:
   - `.env.example` - AFB + CRON_SECRET environment variables added
   - `.github/workflows/afb-sync.yml` - GitHub Actions Scheduler configuration
   - `docs/index.md` - operations/ section added with 3 new documents

#### 🎯 Next Actions (User Setup Required)

**Step 1: Environment Variables Configuration** (30 minutes)
1. GitHub Secrets setup:
   - Generate CRON_SECRET: `openssl rand -base64 32`
   - Add CRON_SECRET to GitHub repository secrets
   - Add APP_URL: `https://win2.vercel.app`

2. Vercel environment variables:
   - Add CRON_SECRET (same value as GitHub)
   - Add AFB_PARTNER_ID (from AFB dashboard)
   - Add AFB_API_KEY (from AFB dashboard)
   - Redeploy Vercel project

**Step 2: GAS Code Update** (30 minutes)
1. Open Google Sheets → Extensions → Apps Script
2. Update `Code.gs` following `docs/operations/gas-a8net-update-guide.md`
3. Add A8.net header candidates and status values
4. Save and test with existing A8.net CSV

**Step 3: Test AFB Automated Polling** (15 minutes)
1. GitHub Actions → AFB成果データ同期 → Run workflow (manual trigger)
2. Check execution logs for success
3. Verify Google Sheets「成果CSV_RAW」updated

**Step 4: A8.net Manual CSV Test** (10 minutes)
1. Download Parameter Tracking Report CSV
2. Paste into Google Sheets「成果CSV_RAW」
3. Run GAS manually or wait for daily execution
4. Verify「成果データ」sheet updated

#### 📊 Implementation Status Summary

- **A8.net Parameter Tracking**: ✅ Verified working (CSV export with id1 column)
- **AFB Automated Polling**: ✅ Implemented (GitHub Actions + CRON_SECRET auth)
- **Hybrid Workflow**: ✅ Established (AFB auto + A8.net manual)
- **Documentation**: ✅ Complete (3 operations manuals + environment setup)
- **GitHub Issue #22**: ✅ Closed with success report
- **Total Implementation Time**: 1 day (code restoration + docs)

**Key Takeaway**: Both ASPs now have established workflows. AFB is fully automated (10-minute polling), and A8.net requires minimal manual effort (5 minutes/week for CSV download and paste). All成果データ is unified in Google Sheets for member dashboard display.

### Rentracksアフィリエイトトラッキング実装 ✅ Complete (2025-12-04)

**Status**: ✅ Complete - Rentracks Tracking with uix Parameter System
**Implementation Period**: 2025-12-04 (Phases 1-3, approx. 8 hours)
**Related Commits**: a80b8d9, 8e2a254, 5a5d7bc

#### 実装概要

Rentracksアフィリエイトに対して、A8.netと同等の精度（100%）でクリック・成果トラッキングを実現しました。Rentracks公式の`uix`パラメータ仕様を活用し、URLドメイン自動判定により既存A8.net処理との完全な下位互換性を維持しています。

#### ✅ Phase 1: URLドメイン自動判定実装

**File**: `app/api/track-click/route.ts` (L114-143)

**実装内容**:
- URLドメイン（`rentracks.jp` / `rentracks.co.jp`）から自動でASP判定
- Rentracks案件: `?uix={memberId}-{eventId}` パラメータ付与
- A8.net等その他ASP: 既存の `?id1={memberId}&id2={eventId}&eventId={eventId}` 形式を維持
- if-else分岐により完全な下位互換性を保証

**Technical Details**:
```typescript
// URLドメインでASP判定（Rentracks: rentracks.jp/rentracks.co.jp）
if (urlLower.includes("rentracks.jp") || urlLower.includes("rentracks.co.jp")) {
  // Rentracks方式: uix パラメータ
  const uixValue = `${trackingId}-${eventId}`;
  trackingUrl.searchParams.set("uix", uixValue);
} else {
  // A8.net等その他ASP: id1, id2, eventId パラメータ（既存処理）
  trackingUrl.searchParams.set("id1", trackingId);
  trackingUrl.searchParams.set("id2", eventId);
  trackingUrl.searchParams.set("eventId", eventId);
}
```

**Test Results**:
- ✅ TC4 (Rentracks案件): uixパラメータ正常生成
- ✅ TC2 (A8.net回帰テスト): 既存処理に影響なし

#### ✅ Phase 2: GAS v4.1.0実装（Rentracks CSV対応）

**File**: `google-spread-sheet/code.gs.js` (v4.0.0 → v4.1.0)

**実装内容**:

1. **HEADER_CANDIDATES拡張** (L34-67)
   - Rentracks CSVヘッダー追加（備考、uix、プロダクト、状況）
   - A8.net既存ヘッダーは全て維持
   - 柔軟なヘッダー検出により両ASPに対応

2. **uix分割処理実装** (L153-170)
   - `{memberId}-{eventId}` 形式を自動分割
   - UUID v4の5パーツ構造を利用（`parts.length > 5`チェック）
   - `guest:UUID` 形式にも対応
   - A8.net CSVは分割処理をスキップ（eventId既存のためif条件不成立）

**Technical Details**:
```javascript
// uix分割処理（Rentracks対応）
if (memberId.includes('-') && (!eventId || eventId === '')) {
  const parts = memberId.split('-');

  // UUID形式は5パーツ（xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）
  if (parts.length > 5) {
    memberId = parts.slice(0, 5).join('-');  // UUID v4抽出
    eventId = parts.slice(5).join('-');      // eventId抽出
    console.log(`[info] uix分割成功: memberId=${memberId}, eventId=${eventId}`);
  } else {
    console.log(`[warn] uix分割失敗（パーツ不足）: ${memberId}`);
  }
}
```

**下位互換性保証**:
- A8.net CSV: memberId/eventId列が別々 → 分割処理スキップ
- Rentracks CSV: 備考列にuix値 → 分割処理実行
- 両ASP CSVの同時処理が可能

#### ✅ Phase 3: 運用ドキュメント作成

**Created Files**:

1. **`docs/operations/gas-deployment-guide.md`** (165 lines)
   - GASデプロイ手順（v4.1.0対応）
   - v4.1.0変更点詳細（HEADER_CANDIDATES、uix分割処理）
   - トラブルシューティング（5パターン）
   - サンプルCSVテストデータ

2. **`docs/operations/rentracks-conversion-matching.md`** (600+ lines)
   - システムフロー図
   - 週1回の運用フロー（5分）
   - 詳細手順（Rentracksログイン → CSV取得 → GAS実行 → 確認）
   - トラブルシューティング（5問題パターン）
   - 技術仕様（uixフォーマット、CSV構造、GAS処理フロー）
   - FAQ（8項目）

3. **`docs/index.md`** 更新
   - 新規ドキュメント追加（tree構造、operations/テーブル）
   - 2025-12-04 changelogエントリ追加

#### 技術仕様詳細

**uixパラメータフォーマット**:
```
形式: {memberId}-{eventId}
例: b91765a2-f57d-4c82-bd07-9e0436f560da-event-uuid-123
文字数: 約73文字（Rentracks制限512文字内で安全）
```

**Rentracks CSV構造**:
- **備考列**: uix値（`{memberId}-{eventId}`）
- **プロダクト列**: 案件名
- **状況列**: ステータス（承認/保留/拒否）

**運用フロー** (週1回、5分):
```
Rentracks管理画面 → 注文リストCSVダウンロード
→ Google Sheets「成果CSV_RAW」貼付 → GASメニュー実行
→ クリックログF/G列自動更新 → 「成果データ」シート出力
→ 会員マイページ表示
```

#### 実装成果

- ✅ Rentracksトラッキング精度: 100%（A8.netと同等）
- ✅ 既存A8.net処理への影響: 0（完全な下位互換性）
- ✅ 運用負荷: 週1回5分（A8.netと同等）
- ✅ guest:UUID対応: 完全対応（非会員成果も追跡可能）
- ✅ ドキュメント: 完備（デプロイガイド、運用マニュアル）

**Git Commits**:
- a80b8d9: FEATURE: Rentracksトラッキング対応（URLドメイン自動判定）
- 8e2a254: FEATURE: GAS Rentracksマッチング対応（uix分割処理）
- 5a5d7bc: DOC: GASデプロイガイド作成（Rentracks対応v4.1.0）

**Operations Documentation**:
- `docs/operations/gas-deployment-guide.md`: GAS deployment steps for v4.1.0
- `docs/operations/rentracks-conversion-matching.md`: Complete weekly operations manual

## Environment Variables Setup

All environment variables should be stored in `.env.local` (never commit this file).

### Required Environment Variables

```bash
# microCMS API (content management)
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# Google Sheets API (member database & tracking)
GOOGLE_SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id

# Next-Auth (session management)
NEXTAUTH_URL=http://localhost:3000  # or production URL
NEXTAUTH_SECRET=your-secret-key     # Generate with: openssl rand -base64 32

# Resend (email sending) - Feature Flag Controlled
RESEND_VALID=false  # true=Email verification enabled, false=Skip email verification (default)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=onboarding@resend.dev  # Development: onboarding@resend.dev, Production: noreply@yourdomain.com

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Used for email verification links

# Google Tag Manager (Analytics)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  # GTM container ID (optional, analytics will not work without it)
```

### Environment Variable Notes

- **GOOGLE_SHEETS_PRIVATE_KEY**: Must include literal `\n` characters (not actual newlines)
- **NEXTAUTH_SECRET**: Generate unique secret for each environment (dev/staging/prod)
- **RESEND_VALID**: Controls email functionality (default: `false` due to Wix DNS restrictions). Set to `true` only after DNS migration.
- **RESEND_FROM_EMAIL**: Development uses `onboarding@resend.dev`, production requires verified domain
- **NEXT_PUBLIC_GTM_ID**: GTM container ID for analytics tracking. If not set, GTM components will warn but not break the app. See `docs/analytics/gtm-setup.md` for setup guide.
- **NEXT_PUBLIC_* variables**: Exposed to browser, use for non-sensitive config only

### Template File

See `.env.example` in project root for a complete template with all required variables.

## External Service Credentials

ASPログイン認証情報（A8.net, AFB, もしもアフィリエイト, バリューコマース）はリポジトリ外のセキュアストレージで管理してください（例: 共有パスワードマネージャ）。

Google Sheets: See `docs/google.md` for spreadsheet URL and GAS editor link.

## Security Response History

### 2025-12-29: CVE-2025-55184/67779/55183 対応
- **脆弱性**: React Server Components DoS攻撃 (High, CVSS 7.5) + ソースコード露出 (Medium, CVSS 5.3)
- **対応内容**: Next.js 15.5.7 → 15.5.9 へアップグレード
- **方法**: Vercel公式パッチブランチ（`origin/vercel/react-server-components-cve-vu-vf7qpq`）をマージ
- **コミット**: 10c8149
- **ブランチ**: feature/age-restricted-content
- **検証結果**: ✅ pnpm audit でCVE-2025-55184/67779/55183 検出されず
- **参考**: [Next.js Security Update: December 11, 2025](https://nextjs.org/blog/security-update-2025-12-11)

### 過去のセキュリティ対応
- **2025-12-XX**: CVE-2025-55182 対応 (React RCE)
  - React 19.2.0 → 19.2.1
  - Next.js 15.5.6 → 15.5.7
  - コミット: ff5ed61

### 2025-01-19: Node.js v22.22.0 + pnpm overrides設定（CVE-2025-55131/59465/55130/56041/55132対応）
- **脆弱性**:
  - CVE-2025-55131 (HIGH): Buffer memory leak
  - CVE-2025-59465 (HIGH): HTTP/2 server crash DoS
  - CVE-2025-55130 (HIGH): fs permission model bypass
  - CVE-2025-56041 (MEDIUM): fs.lstat bypass
  - CVE-2025-55132 (MEDIUM): child_process.spawn shell injection
- **対応内容**:
  - Node.js v22.22.0確認済み（既にインストール済み）
  - package.json engines設定追加（Node.js >=22.22.0, pnpm >=10.0.0）
  - pnpm overrides設定追加（Next.js 15.5.9強制、react-email依存解決）
  - vercel.json作成（Node.js v22.x系強制、API Routes明示的指定）
  - .nvmrc作成（開発環境バージョン統一: 22.22.0）
- **影響**:
  - アプリケーションコード変更なし（CVE露出ゼロのため）
  - react-email依存の古いNext.js（15.1.2）をoverridesで15.5.9に強制上書き
  - Vercel本番環境のNode.jsランタイムセキュリティ強化
- **ブランチ**: feature/age-restricted-content
- **検証結果**: ✅ pnpm audit --prod でCritical/High脆弱性0件
- **参考**: [Node.js Security Release: December 2025](https://nodejs.org/en/blog/vulnerability/december-2025-security-releases)

## Testing Strategy

When implementing tracking functionality:
1. Test with guest:UUID flow (non-member)
2. Test with authenticated member flow
3. Verify id1 parameter appears in redirect URL
4. Manually verify click log appears in Google Sheets
5. Test end-to-end with A8.net test account

## Future Enhancements

### Phase 4 (Planned)
- Deal listing page (member-only) with filtering
- Advanced search functionality for blogs and deals
- User profile page with avatar upload
- Email notification settings

### Phase 5 (Optional)
- Admin dashboard for content management
- Subdomain support (gambling/fortune-telling categories)
- Agency/referral system with tiered rewards
- Multiple ASP support expansion (AFB, もしも, バリュコマ)
- Analytics dashboard (conversion rates, popular deals)
- A/B testing for blog CTAs

## Documentation System

This project follows a strict documentation hierarchy:

1. **This file (CLAUDE.md)**: High-level architecture, tech stack, and critical implementation notes
2. **docs/index.md**: Documentation index and operational rules
3. **docs/ subdirectories**: Detailed specifications, guides, and architecture decisions

**Important**: When making architectural changes or discovering new knowledge:
- Update relevant files in `docs/` directory
- Update `docs/index.md` to reflect new/changed documentation
- Use `DOC:` commit prefix for documentation changes
- See `.claude/CLAUDE.md` for full documentation workflow

**Key Documentation Files:**
- `docs/specs/spec.md`: Complete requirements specification
- `docs/specs/google.md`: Google Sheets structure and GAS code
- `docs/microcms-setup.md`: microCMS API configuration guide
- `docs/email-setup.md`: Resend email integration setup
- `docs/seo-implementation.md`: SEO implementation guide (metadata, OGP, Twitter Card, JSON-LD)
- `docs/guides/cta-shortcode-guide.md`: CTA shortcode usage (client-facing)
- `docs/guides/cta-technical-guide.md`: CTA implementation details (developer-facing)

## Quick Reference

### Most Common Tasks

**Adding a new API route:**
1. Create `app/api/[route-name]/route.ts`
2. Use appropriate HTTP methods (GET, POST, PUT, DELETE)
3. Add Zod validation schema in `lib/validations/`
4. Use `getServerSession(authOptions)` for protected routes
5. Return `NextResponse.json()` for responses

**Creating a new page:**
1. Create file in `app/[page-name]/page.tsx`
2. Use `export const metadata` for SEO
3. Use Server Components by default (no "use client")
4. Only add "use client" if using hooks, event handlers, or state

**Adding a microCMS content type:**
1. Define type in `types/microcms.ts`
2. Add fetch function in `lib/microcms.ts`
3. Update `docs/microcms-setup.md` with field definitions
4. Test with sample data in microCMS dashboard

**Google Sheets operations:**
1. Use functions from `lib/sheets.ts`
2. Column indices: 0-based (A=0, B=1, C=2, etc.)
3. Always validate data with Zod before writing
4. Use batch operations when possible to avoid rate limits

**Working with authentication:**
- Check session: `const session = await getServerSession(authOptions)`
- Protected routes: Use middleware in `middleware.ts` or check session in API
- Session data structure: `{ user: { memberId, email, name } }`
- Cookie-based guest tracking: Use `lib/guest-uuid.ts` functions

## Important Implementation Notes for Claude Code

### Before Starting Any Task

1. **Check documentation first**: Review `docs/index.md` for existing knowledge
2. **Verify Phase status**: Check Implementation Status section above
3. **Review related files**: Use Code Navigation section to locate relevant code
4. **Plan with Task Master**: If available, use `task-master next` to get assigned task

### Common Pitfalls to Avoid

- **Don't skip logging in /api/track-click**: Every click must be logged for conversion tracking
- **Don't modify GAS code**: Unless explicitly requested, GAS runs autonomously
- **Don't commit .env files**: Always use .env.local for local development
- **Don't use client components unnecessarily**: Default to Server Components
- **Don't ignore TypeScript errors**: Strict mode is enabled for a reason
- **Don't forget Zod validation**: Always validate external inputs (forms, API payloads)

### When Making Architectural Decisions

If you need to make a significant architectural decision:
1. Document the decision in `docs/` with rationale
2. Update `docs/index.md` to reference the new documentation
3. Use `DOC:` prefix in commit message
4. Consider creating an ADR (Architecture Decision Record) for major decisions

### Code Quality Standards

- **Type safety**: No `any` types unless absolutely necessary (use `unknown` instead)
- **Error handling**: All API routes must have try-catch and return appropriate status codes
- **Input validation**: Use Zod schemas for all user inputs
- **Security**: Never expose sensitive data in client-side code
- **Performance**: Use React Server Components and Next.js caching strategies

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
