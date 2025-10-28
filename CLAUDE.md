# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WIN×Ⅱ is a membership-based affiliate blog platform that provides cashback to members on ASP (Affiliate Service Provider) deals. The system tracks conversions using unique member IDs (or guest UUIDs for non-members) and calculates cashback based on approved conversions.

## Tech Stack

**Frontend & Backend:**
- Next.js 15.1.4 (App Router)
- React 19
- TypeScript 5 (strict mode, noUncheckedIndexedAccess enabled)
- TailwindCSS v3.4.1 (v4 planned for future)
- shadcn/ui for UI components
- Next-Auth v5.0.0-beta.29 (AuthJS) for authentication

**Data Management:**
- microCMS v3.2.0: Blog posts and deal information
- Google Sheets API (googleapis v164.1.0): Member database and conversion tracking
- Existing Google Apps Script (GAS) runs daily at 3:10 AM for data aggregation

**External Integration:**
- Primary: A8.net
- Future: AFB, もしもアフィリエイト, バリューコマース

**Key Dependencies:**
- bcryptjs v3.0.2 (password hashing, salt rounds: 10)
- zod v4.1.12 (validation)
- class-variance-authority v0.7.1 (component variants)
- Radix UI primitives (@radix-ui/react-slot, @radix-ui/react-label)

**Deployment:**
- Vercel

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

### Cashback Calculation Flow

```
User clicks deal → /api/track-click logs click → Redirect to ASP with id1 parameter
→ Conversion occurs on ASP → Manual CSV export → Paste into "成果CSV_RAW" sheet
→ GAS runs daily at 3:10 → Matches id1 with memberId → Calculates 20% cashback (approved only)
→ Outputs to "成果データ" sheet → Member views in /mypage/history
```

**Important**: Non-members (`guest:UUID`) get 0 cashback but conversions are still tracked.

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
   - GAS output with calculated cashback
   - Columns: 氏名, 案件名, 承認状況, キャッシュバック金額, memberId(参考), 原始報酬額(参考), メモ

## microCMS API Design

### API 1: blogs
- Contains: title, slug, content, thumbnail, category, relatedDeals, SEO fields
- Used for: Blog listing and detail pages

### API 2: deals
- Contains: dealId, dealName, aspName, description, rewardAmount, cashbackRate, affiliateUrl
- Used for: Deal listing (member-only) and inline CTAs in blog posts
- **Key field**: `affiliateUrl` - template URL to which `?id1={memberId}` is appended

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

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking (TypeScript)
# Note: Use tsc --noEmit for manual type checking
npx tsc --noEmit
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
5. Append `?id1={memberId}` to `affiliateUrl`
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
- Calculates cashback: reward × 20% (floor rounding)
- Only pays on approved conversions (configurable)
- Handles guest:UUID as "非会員" with 0 cashback
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

### Phase 2: 認証・会員機能 ✅ Completed (Phase 2-1 only)
1. ✅ Email verification system (Resend integration)
   - Verification token generation with JWT
   - Email templates and sending
   - Token validation and email update in Google Sheets
2. ✅ Password reset flow (forgot-password, reset-password pages)
   - Password reset token generation
   - Email notification
   - Password update functionality
3. ⏭️ Phase 2-2 Admin Dashboard - **Skipped** (not critical)
4. ⏭️ Phase 2-3 Advanced features - **Skipped** (not critical)

### Phase 3: ブログ機能 ✅ Completed (100%)
1. ✅ Blog components
   - BlogCard component (thumbnail, title, excerpt, category badges)
   - DealCTAButton component (tracking + redirect)
   - Pagination component (smart page numbering)
   - **BlogContent component v2.0.0** (Markdown/HTML auto-detection, state-driven rendering)
2. ✅ Blog pages
   - Blog listing page (/blog) with pagination
   - Blog detail page (/blog/[slug]) with SEO/OGP
   - Category page (/category/[slug]) with filtering
   - Homepage update with hero section and recent blogs
3. ✅ microCMS integration
   - Complete API setup (blogs, deals, categories)
   - Type definitions and SDK helpers
   - Documentation (docs/microcms-setup.md)
4. ✅ SEO optimization
   - Dynamic metadata generation
   - Open Graph Protocol support
   - Twitter Card support
5. ✅ CTA Shortcode Feature (Blog内CTAボタン)
   - **BlogContent component**: `[CTA:dealId]` shortcode detection and conversion to interactive buttons
   - **Markdown support**: react-markdown integration with remark-gfm and rehype-raw plugins
   - **Google Sheets integration**: Deal master column mapping fixes (A=affiliateUrl, B=dealId)
   - **GAS automation**: onEdit trigger for auto-filling deal name, ASP name, and default values
   - **Documentation**: Client guide (docs/guides/cta-shortcode-guide.md) and technical spec (docs/guides/cta-technical-guide.md)
   - **Click tracking**: Full integration with /api/track-click (id1 + eventId parameters)

## External Service Credentials

See `docs/asp.md` for ASP login credentials (A8.net, AFB, もしもアフィリエイト, バリューコマース).

Google Sheets: See `docs/google.md` for spreadsheet URL and GAS editor link.

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
- Agency/referral system with tiered cashback
- Multiple ASP support expansion (AFB, もしも, バリュコマ)
- Analytics dashboard (conversion rates, popular deals)
- A/B testing for blog CTAs

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
