# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WIN×Ⅱ is a membership-based affiliate blog platform that provides cashback to members on ASP (Affiliate Service Provider) deals. The system tracks conversions using unique member IDs (or guest UUIDs for non-members) and calculates cashback based on approved conversions.

## Tech Stack

**Frontend & Backend:**
- Next.js 15.5.6 (App Router)
- React 19
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

# Resend (email sending)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=onboarding@resend.dev  # Development: onboarding@resend.dev, Production: noreply@yourdomain.com

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Used for email verification links
```

### Environment Variable Notes

- **GOOGLE_SHEETS_PRIVATE_KEY**: Must include literal `\n` characters (not actual newlines)
- **NEXTAUTH_SECRET**: Generate unique secret for each environment (dev/staging/prod)
- **RESEND_FROM_EMAIL**: Development uses `onboarding@resend.dev`, production requires verified domain
- **NEXT_PUBLIC_* variables**: Exposed to browser, use for non-sensitive config only

### Template File

See `.env.example` in project root for a complete template with all required variables.

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
