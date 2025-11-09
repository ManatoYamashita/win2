# ASP API Integration - Webhook/Postback URL Specifications

**Last Updated:** 2025-01-03

## Overview

This document outlines the investigation results for ASP (Affiliate Service Provider) webhook/postback URL capabilities for real-time conversion notifications. Each ASP has different levels of public API documentation and webhook support.

## Investigation Summary

| ASP | Webhook/Postback Support | Public Documentation | Status |
|-----|--------------------------|---------------------|--------|
| A8.net | ⚠️ **Parameter Tracking (CSV Manual)** | Available | ✅ **Primary Implementation Target** |
| afb (アフィb) | ✅ Real-time Postback System | Limited (Login Required) | ⏸️ **Deferred (Vercel Cron Limitation)** |
| もしもアフィリエイト | ❌ Unknown | None | ⚠️ Contact Support Required |
| バリューコマース | ❌ Unknown | None | ⚠️ Contact Support Required |

---

## A8.net

### ⚠️ UNDER REVIEW: Parameter Tracking Report Feature

**Last Updated:** 2025-01-04
**Status:** 🔄 Re-investigation in progress

#### 📋 Executive Summary

A8.net's **Parameter Tracking Report (パラメータ計測レポート)** feature was discovered after initial investigation. This feature may allow individual conversion tracking with id1-id5 parameters for media members. **Management console verification is required** to confirm CSV export capability.

#### ✅ Newly Discovered Information (2025-01-04)

**Parameter Tracking Feature (Official Documentation Confirmed):**
- **Official Support Page:** https://support.a8.net/a8/as/faq/manual/a8-parameter-guide.php
- **Available to Media Members:** Explicitly stated in official documentation
- **Custom Parameters:** id1～id5 can be appended to affiliate links
- **Individual Conversion Tracking:** "成果別の情報" (result-specific information) includes parameter data
- **Filtering:** Parameter tracking report screen allows filtering by specific parameters
- **Data Granularity:** "成果別" reports display "成果件数が1件ごとに" (each conversion individually)

**Parameter Usage:**
```
Format: &id1=value&id2=value...
- Half-width alphanumeric characters only
- Maximum 50 bytes per parameter
- Personal information (PII) must NOT be used
- Multiple parameters can be combined
```

**Parameter Tracking Report Features:**
- Display result-specific information with parameter data
- Filter conversions by specific parameter values
- View individual conversion records (not aggregated)

#### ⚠️ Critical Limitations & Compliance Risks

**1. Advanced Feature - No Official Support:**
- "パラメータを理解している上級者向けの機能" (For advanced users who understand parameters)
- **A8.net does NOT provide support for this feature**
- Self-service troubleshooting required

**2. ⚠️ Point Site Restriction (HIGH RISK):**
> **Official Statement:** "本機能はポイントサイト向けではありません"
> (This feature is NOT intended for point sites)

**Implication for WIN×Ⅱ:**
- WIN×Ⅱ operates a cashback/point reward model
- **High risk of terms of service violation**
- **Account suspension risk**
- **Legal/contractual review required before implementation**

**3. Program Limitations:**
- **Amazon and Rakuten programs are NOT supported**
- Parameter tracking only works with standard affiliate programs

**4. Data Privacy:**
- Personal information (email addresses, names, etc.) must NOT be set as parameter values
- UUID-based member IDs are acceptable

#### ❓ Unverified Items (Requires Management Console Access)

**1. CSV/Excel Export Functionality**
- ✅ **Confirmed:** Other A8.net reports (Conversion Referrer Report) support CSV/Excel export
- ❓ **Unknown:** Whether Parameter Tracking Report also supports export
- 📝 **Action Required:** Login to management console and verify export options

**2. Relationship Between Reports**
- ❓ Is "Parameter Tracking Report" the same as "成果別 (By Result)" report?
- ❓ Previous investigation (2025-01-03) tested "Report Download" button - was this the correct location?
- 📝 **Action Required:** Identify the exact menu path to Parameter Tracking Report

**3. Feature Activation Requirements**
- ❓ Does Parameter Tracking require manual activation/configuration?
- ❓ Was this feature enabled during previous investigation?
- 📝 **Action Required:** Check for settings/configuration options

**4. CSV Column Contents**
- ❓ If CSV export exists, does it include id1～id5 columns?
- ❓ What is the exact column structure?
- 📝 **Action Required:** Download sample CSV and analyze structure

#### 🔄 Contradiction with Previous Assessment (2025-01-03)

**Previous Conclusion:**
```
❌ Individual conversion tracking: NOT POSSIBLE
❌ id1 parameter retrieval: NOT POSSIBLE
Basis: Downloaded CSV from "Report Download" button contained only aggregated program-level data
```

**New Information Suggests:**
```
✅ Parameter tracking feature exists and is available to media members
✅ Individual conversion data can be displayed in "成果別" reports
⚠️ CSV export capability for Parameter Tracking Report: UNCONFIRMED
```

**Possible Explanations:**
1. **Different Report Location:** "Parameter Tracking Report" may be a separate menu item from "Report Download"
2. **Configuration Required:** Feature may need to be enabled/configured before use
3. **Testing Method:** Previous test may not have used the correct report type

#### 📝 Required Verification Steps

**Priority 1: Management Console Verification (CRITICAL) ✅**

**Step 1: Locate Parameter Tracking Report**
1. Login to A8.net media member dashboard
2. Navigate menu to find "パラメータ計測レポート" or "パラメータ計測"
3. Document the exact menu path

**Step 2: Test Link Creation**
1. Select a self-back eligible program
2. Generate affiliate link
3. Manually append `&id1=test_20250104` to the URL
4. Complete self-back application

**Step 3: Verify Report Display**
1. Wait for conversion to be recorded
2. Access Parameter Tracking Report
3. Check if conversion with `id1=test_20250104` appears
4. Document what data fields are displayed

**Step 4: Test CSV Export**
1. Look for "CSV出力" or "Excelダウンロード" button in Parameter Tracking Report
2. If found, download the file
3. Verify if id1 column exists and contains the correct value
4. Document complete column structure

**Step 5: Policy Compliance Check**
1. Review A8.net Terms of Service regarding point sites / cashback models
2. Consider contacting A8.net support to clarify:
   - Whether cashback reward models are permitted
   - Whether parameter tracking can be used for member-specific cashback calculation
   - Any restrictions or guidelines for this use case

**Verification Log Document:** See `docs/dev/a8-parameter-tracking-verification.md`

---

### 📊 Verification Results (2025-01-09) - Parameter Tracking Unavailable

**Last Updated:** 2025-01-09
**Status:** 🔴 **Verification Complete - Feature Likely Unavailable for Media Members**

#### Executive Summary

After 4 weeks of testing (2025-10-13 to 2025-01-09) with the WIN×Ⅱ system correctly generating id1-parameterized affiliate links, the **Parameter Tracking Report shows no data despite A8.net's daily reports confirming 9 clicks**. The technical implementation is working correctly, but **Parameter Tracking functionality appears to be unavailable for Media Member contracts**.

#### Verification Timeline

| Phase | Period | Result |
|-------|--------|--------|
| **System Implementation** | 2025-10-13 | ✅ Complete (id1 + eventId parameters, Google Sheets logging, GAS processing) |
| **Testing Period** | 2025-10-13 to 2025-01-09 (4 weeks) | ✅ 9 clicks recorded across multiple members |
| **A8.net Daily Report Check** | 2025-01-09 | ✅ All 9 clicks confirmed in New Report B version |
| **Parameter Tracking Report Check** | 2025-01-09 (3+ weeks after first click) | ❌ **No data displayed** despite multiple search patterns |
| **CSV Export Check** | N/A | ⏸️ **Unable to verify** (no data to export) |

#### Detailed Test Results

**1. WIN×Ⅱ System Implementation** ✅ **100% Complete**
- id1 parameter appending: ✅ Working (`/api/track-click` generates `?id1={memberId}`)
- eventId parameter appending: ✅ Working (UUID v4 generated per click)
- Google Sheets logging: ✅ Working (all clicks recorded in "クリックログ")
- Debug logging: ✅ Working (console.log shows full tracking URL)
- New tab opening: ✅ Working (affiliate pages open correctly)
- Success toast notification: ✅ Working (user feedback implemented)

**2. A8.net Click Recording** ✅ **Normal Operation**
- **30-Day Click History (2025-10-13 to 2025-01-09)**:
  - 2025-11-08: 2 clicks
  - 2025-11-05: 2 clicks
  - 2025-11-03: 1 click
  - 2025-10-26: 1 click
  - 2025-10-16: 1 click
  - 2025-10-14: 1 click
  - 2025-10-13: 1 click (initial test)
- **Total**: 9 clicks confirmed in A8.net "New Report B" version
- **Data Source**: https://pub.a8.net/a8v2/media/generatingdailyReportAction.do?action=report
- **Conclusion**: A8.net is successfully receiving and recording clicks with id1 parameters

**3. Parameter Tracking Report** ❌ **No Data Displayed**
- **Report URL**: https://media-console.a8.net/report/parameter#
- **Search Patterns Tested** (all returned "指定された条件で表示できるレポートデータがありません"):
  1. Period expansion (past 1 month, past 3 months)
  2. Specific memberId search (tested 3 different member UUIDs)
  3. Program name search
  4. All conditions blank (no filters)
- **Elapsed Time**: 3+ weeks since first click (2025-10-13)
- **Data Lag Hypothesis**: ❌ **Ruled Out** (sufficient time has passed for data to appear)

**4. CSV Export Verification** ⏸️ **Unable to Confirm**
- **Reason**: Parameter Tracking Report shows no data, cannot locate CSV export button
- **id1 Column Check**: ⏸️ **Unable to verify** (no data available to export)

#### Tentative Conclusion

**Parameter Tracking feature is highly likely to be unavailable for Media Member contracts.**

**Evidence**:
1. WIN×Ⅱ system has been operating correctly for 4 weeks (2025-10-13 onwards)
2. A8.net daily reports confirm 9 clicks over 30 days
3. Parameter Tracking Report shows zero data after 3+ weeks
4. Multiple search conditions (period, memberId, program) all yield no results
5. Data lag explanation is ruled out (3+ weeks is more than sufficient)

**Alternative Explanations**:
- Feature may require special activation/configuration not documented
- Media Member contract may have limited access to Parameter Tracking
- Feature may be advertiser-only (despite official documentation stating "available to media members")

#### Next Actions

**Priority 1: A8.net Support Inquiry** 🔥 **CRITICAL - Immediate Action Required**

**Purpose**: Obtain official confirmation whether Parameter Tracking is available for Media Member contracts

**Inquiry Document**: [`docs/dev/a8-support-inquiry-final.md`](./dev/a8-support-inquiry-final.md)

**Key Questions**:
1. Is Parameter Tracking Report available for Media Member contracts?
2. If yes, what are the correct steps to display data in the report?
3. How long does data reflection typically take?
4. If no, what alternative methods exist for member-specific conversion tracking?

**Expected Timeline**: 1-3 business days for support response

---

**Priority 2: Alternative ASP Investigation** ⏸️ **Parallel Action**

To prepare for the possibility that Parameter Tracking is unavailable, investigate alternative ASPs:

**Option A: もしもアフィリエイト (Moshimo Affiliate)** - Priority 1 Alternative
- Member-specific tracking capability: ❓ Unknown (requires investigation)
- Parameter-based link support: ❓ Unknown
- CSV export functionality: ❓ Unknown
- **Action**: Contact support, review management console

**Option B: バリューコマース (ValueCommerce)** - Priority 2 Alternative
- LinkSwitch feature: ❓ Member-specific tracking capability unknown
- API integration: ❓ Requires investigation
- **Action**: Login to dashboard, check for parameter tracking features

**Option C: AFB Re-implementation** - Technical Fallback (Highest Certainty)
- **Status**: Previously implemented and tested, removed due to Vercel Cron limitations
- **Commit**: Code preserved in commit `b8e9b98`
- **Re-implementation Approach**: GitHub Actions Scheduler instead of Vercel Cron
- **Webhook Endpoint**: Already implemented and tested (`/api/webhooks/afb-postback`)
- **Estimated Time**: 1 day (GitHub Actions configuration + code restoration)
- **Certainty**: ✅ **High** (technical implementation already proven)

---

#### Implementation Decision Matrix

**Scenario A: A8.net Support Confirms Feature Available** ✅

**Actions**:
1. Follow support instructions to enable/configure Parameter Tracking
2. Verify data appears in report
3. Confirm CSV export includes id1 column
4. Create operations manual for daily CSV download workflow
5. Begin production use

**Timeline**: 1-2 days

---

**Scenario B: A8.net Support Confirms Media Member Limitation** ❌

**Actions**:
1. Document final conclusion in `docs/dev/a8-parameter-tracking-verification.md`
2. Close GitHub Issue #22 with negative result
3. Change A8.net operation policy to "aggregate reporting only (no member-specific cashback)"
4. Prioritize alternative ASP implementation:
   - **First**: もしもアフィリエイト investigation (1-2 weeks)
   - **Second**: バリューコマース investigation (1-2 weeks)
   - **Fallback**: AFB re-implementation with GitHub Actions (1 day)

**Timeline**: 1 day (documentation) + 1-2 weeks (alternative ASP) OR 1 day (AFB re-implementation)

---

#### Related Documentation

- **Verification Log**: [`docs/dev/a8-parameter-tracking-verification.md`](./dev/a8-parameter-tracking-verification.md) - Detailed daily verification records
- **Support Inquiry**: [`docs/dev/a8-support-inquiry-final.md`](./dev/a8-support-inquiry-final.md) - Final support inquiry text
- **Issue Update**: [`docs/dev/github-issue-22-update.md`](./dev/github-issue-22-update.md) - GitHub Issue #22 update template
- **GitHub Issue**: #22 - A8.net Parameter Tracking Report CSV検証と運用フロー確立

---

#### Official A8.net Documentation References

The following official documentation was referenced during verification:

1. **Parameter Tracking Guide**
   - URL: https://support.a8.net/a8/as/faq/manual/a8-parameter-guide.php
   - Content: Parameter measurement feature overview, id1-id5 parameter usage, report screen explanation

2. **New Report Help**
   - URL: https://support.a8.net/as/newreport/help/
   - Content: New Report B version usage, report interpretation, data update frequency

3. **Report Renewal Notice**
   - URL: https://support.a8.net/as/campaign/report_renewal/
   - Content: Migration from old report to New Report B, new feature announcements

---

**Priority 2: Contact A8.net Support (If Verification Successful)**

**Questions to Ask:**
1. Can media members export CSV data from Parameter Tracking Reports?
2. Is a cashback/point reward business model compliant with A8.net policies?
3. Are there any restrictions on using parameter tracking for member-specific conversion attribution?
4. What is the recommended approach for tracking individual member conversions?

**Risk Assessment:**
- Contacting support may trigger policy review
- If cashback model is non-compliant, account could be flagged
- Consider consulting with legal/business team before reaching out

#### 🎯 Implementation Decision Matrix

**Scenario A: ✅ Parameter Tracking Report Supports CSV Export with id1**

**Actions:**
- Proceed with A8.net integration for WIN×Ⅱ
- Existing implementation (id1 parameter appending) is already complete
- Update documentation with CSV download procedures
- Create operational manual for Parameter Tracking Report usage

**Timeline:** 1-2 days (documentation only)

**Scenario B: ❌ CSV Export Not Available OR id1 Not Included**

**Actions:**
- Previous assessment (implementation blocked) was correct
- Maintain "afb first" priority
- Use A8.net for aggregate reporting only (no member-specific cashback)

**Timeline:** No additional work required

**Scenario C: ⚠️ Terms of Service Violation Risk Confirmed**

**Actions:**
- **Discontinue A8.net integration entirely**
- Remove A8.net deals from platform
- Focus exclusively on afb and other ASPs
- Consider alternative ASPs with clear cashback policy support

**Timeline:** 1 day (removal of A8.net references)

#### 📚 Reference: Previous Investigation Results (2025-01-03)

**What Was Tested:**
- **Location:** "Report Download" button on management console top page
- **Downloaded:** Program list CSV
- **Contents:** 広告主ID, 広告主名, プログラムID, プログラム名, 今月の報酬額, 昨日売上数, 昨日クリック数...

**What Was Concluded:**
- Only program-level aggregated data available
- No individual conversion records
- No custom tracking parameters (id1, eventId)

**What May Have Been Missed:**
- Parameter Tracking Report as a separate menu item
- Feature activation/configuration requirements
- Self-back testing with parameter-appended links

#### 🔗 Official Resources

- **Parameter Tracking Guide:** https://support.a8.net/a8/as/faq/manual/a8-parameter-guide.php
- **Report Usage Guide:** https://support.a8.net/a8/as/faq/manual/report.php
- **A8.net Help Index:** https://support.a8.net/a8/as/faq/manual/

---

### Available Methods (For Reference - Advertiser-Only)

#### 1. Session Tracking (セッショントラッキング)

**Direction:** Advertiser → A8.net (For sending conversion data TO A8.net)

**Endpoint:**
```
https://px.a8.net/a8fly/earnings
```

**Parameters:**
- `a8`: Click identifier (A8パラメータ) - Provided when users click the ad
- `pid`: Program ID (e.g., `s00000000062001`)
- `so`: Order number
- `si`: Product details in format: `{price}-{quantity}-{total}-{product_code}`
- `currency`: Currency code (e.g., `JPY`)

**Response:**
- Returns "0" in text/plain format when successful

**Example Request:**
```
https://px.a8.net/a8fly/earnings?a8=CLICK_ID&pid=s00000000062001&so=ORDER123&si=1000-1-1000-PRODUCT001&currency=JPY
```

#### 2. JS Tag Tracking (JSタグトラッキング)

JavaScript-based tracking where click identifiers are stored in cookies.

#### 3. EC Sales Confirmation API (売上確定API)

API for automating the process of confirming affiliate conversions (reduces manual workload).

**Access Requirements:**
- Advertiser ID or Program ID
- Permitted IP addresses for access control
- Contact A8.net support for API access

### Webhook Support (A8.net → External System)

⚠️ **Status:** Not publicly documented

**Investigation Needed:**
- Whether A8.net can send postback notifications to external URLs when conversions occur
- Webhook payload format and parameters
- Authentication/signature verification methods
- Event types (conversion created, approved, cancelled)

**Next Steps:**
1. Login to A8.net advertiser dashboard
2. Check for "Postback URL" or "Webhook" settings
3. Contact A8.net support with advertiser ID for API documentation
4. Request technical specifications for real-time conversion notifications

### Official Documentation

- **A8.net Documents**: http://document.a8.net/a8docs/
- **Session Tracking Specification**: document.a8.net/a8docs/a8-tracking/session-tracking/
- **JS Tag Tracking Specification**: document.a8.net/a8docs/a8-tracking/js-tracking/

---

## afb (アフィb)

### ⏸️ DEFERRED: Real-time Postback System

**Last Updated:** 2025-01-05
**Status:** ⏸️ Implementation deferred due to Vercel Cron limitations

#### Deferral Reason

**Vercel Free Plan Limitation:**
- Vercel Cron is required for API polling-based integration
- Free plan has insufficient Cron execution quota
- Caused deployment failures

**Implementation Status:**
- ✅ Type definitions (types/afb-postback.ts) - **DELETED**
- ✅ Webhook endpoint (app/api/webhooks/afb-postback/route.ts) - **DELETED**
- ✅ API client (lib/asp/afb-client.ts) - **DELETED**
- ✅ Conversion matcher (lib/matching/conversion-matcher.ts) - **DELETED**

**Re-implementation Requirements:**
- Alternative scheduler solution (GitHub Actions, external cron service)
- OR upgrade to Vercel Pro plan
- OR switch to AFB Postback-only approach (no polling)

---

### Real-time Postback System (For Future Reference)

✅ **Capability:** Available

afb provides a real-time postback system that automatically notifies publishers (media operators) about affiliate conversions. This allows centralized management of conversion data across multiple ASPs.

### API Integration

afb offers two types of API integration:
1. Sending conversion data to external advertising platforms (TikTok, Facebook, etc.)
2. API key issuance through the afb management console

### Features

- **Real-time notifications** of conversion events
- **Status notifications**: Unapproved (未承認), Approved (承認), Cancelled (キャンセル)
- Integration with external ad platforms

### Access Requirements

⚠️ **Technical specifications are only available through the afb advertiser dashboard**

**Next Steps:**
1. Login to afb advertiser dashboard using credentials from `docs/specs/asp.md`
   - ID: `ohshiro-group`
   - PW: `kanri1993`
2. Navigate to API settings or documentation section
3. Download official postback URL specification document
4. Obtain API keys and webhook configuration details

### Expected Webhook Configuration

Based on standard ASP practices, afb's postback system likely includes:

**Postback URL Format:**
```
https://yourdomain.com/api/webhooks/asp-conversion?asp=afb
```

**Expected Parameters:**
- `id1` or `tracking_id`: Member tracking identifier
- `eventId`: Event identifier (if supported)
- `program_id`: Affiliate program identifier
- `order_id`: Order/transaction identifier
- `reward`: Commission amount
- `status`: Conversion status (pending, approved, cancelled)
- `timestamp`: Event timestamp

**Authentication:**
- Likely uses HMAC-SHA256 signature verification
- Or IP whitelist authentication

### Official Resources

- **afb API Integration Guide**: https://www.afi-b.com/guide/api-linkage/
- **Real-time Postback System**: https://www.afi-b.com/guide/realtime-postback/
- **Management Console**: Login required for detailed documentation

---

## もしもアフィリエイト (Moshimo Affiliate)

### Investigation Results

❌ **Status:** No public webhook/postback documentation found

### Available Conversion Tracking Methods

1. **Tag Embedding Method** (タグ埋め込み方式)
2. **Session-based Method** (セッション方式) - Recommended for ITP compliance

### Mobile App Tracking

Moshimo Affiliate supports integration with:
- Adjust
- AppsFlyer

This suggests potential postback capability through third-party platforms.

### Supported Shopping Carts

- Shopserve
- SELLECTTYPE
- Shopify
- カラーミーショップ (Color Me Shop)
- メイクショップ (MakeShop)
- BASE
- STUDIO
- hocomono

### Access Requirements

⚠️ **Technical documentation not publicly available**

**Next Steps:**
1. Login to もしもアフィリエイト advertiser dashboard using credentials from `docs/specs/asp.md`
   - ID: `ohshiro-group`
   - PW: `kanri199308`
2. Check for API/Webhook settings in the management console
3. Contact support if documentation is not available in dashboard
   - Support Email: `kanri@moshimo.com`
4. Request postback URL specifications and API documentation

### Recommendations

Since public documentation is unavailable:
- Postback/webhook functionality may be provided on a case-by-case basis
- May require special configuration through support team
- Registered advertisers (マーチャント) may have access to private documentation

### Official Resources

- **Advertiser Portal**: https://af.moshimo.com/af/www/merchant
- **FAQ**: https://af.moshimo.com/af/www/merchant/help

---

## バリューコマース (ValueCommerce)

### Investigation Results

❌ **Status:** No public webhook/postback documentation found

### Available Methods

#### 1. iTrack2.0 System

**Direction:** Advertiser → ValueCommerce

ValueCommerce's conversion tracking system includes:
- Conversion tag embedding
- URL request notifications (URLリクエスト通知)
- Batch retry mechanism for failed transmissions

#### 2. Transaction API

**Direction:** ValueCommerce ← External System (Data retrieval)

- Bearer token authentication
- Access to order/transaction databases
- Report API for data integration

### Access Requirements

⚠️ **Webhook specifications not publicly documented**

**Next Steps:**
1. Login to バリューコマース advertiser dashboard using credentials from `docs/specs/asp.md`
   - ID: `info@ohshiro-group.com`
   - PW: `Kanri1993`
2. Check management portal for webhook/postback settings
3. Contact ValueCommerce support for technical integration documentation
4. Request API specifications for real-time conversion notifications

### Expected Capabilities

Based on typical ASP functionality, ValueCommerce may support:
- Real-time conversion notifications
- Status update notifications (approved/cancelled)
- Server-to-server postback URLs

### Official Resources

- **Advertiser Portal**: https://www.valuecommerce.ne.jp/ecsite/
- **API Documentation**: Likely available after advertiser registration
- **Help Center**: https://help.valuecommerce.ne.jp/mer/

---

## General Webhook Implementation Considerations

### Standard ASP Postback Parameters

Most ASPs typically include the following in webhook notifications:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `tracking_id` / `id1` | Tracking identifier from click | `member123` or `guest:uuid` |
| `event_id` | Unique event identifier | `550e8400-e29b-41d4-a716-446655440000` |
| `program_id` | Affiliate program identifier | `PRG12345` |
| `order_id` | Order/transaction number | `ORD-2025-001` |
| `amount` / `reward` | Commission amount | `1000.00` |
| `currency` | Currency code | `JPY` |
| `status` | Conversion status | `pending`, `approved`, `cancelled` |
| `timestamp` | Event occurrence time | ISO 8601 format |
| `signature` | HMAC signature for verification | SHA256 hash |

### Security Considerations

**Authentication Methods:**
1. **HMAC Signature Verification** (Recommended)
   - Each webhook request includes a signature header
   - Calculated using shared secret key
   - Algorithm: HMAC-SHA256

2. **IP Whitelist**
   - Restrict webhook endpoint to ASP server IPs
   - Verify origin IP address

3. **API Key Authentication**
   - Include API key in request headers
   - Verify key matches configuration

**Best Practices:**
- Always validate webhook signatures
- Implement idempotency (prevent duplicate processing)
- Use HTTPS for all webhook endpoints
- Log all webhook requests for debugging
- Implement retry logic with exponential backoff
- Return appropriate HTTP status codes (200, 400, 500)

### Webhook Endpoint Requirements

**URL Format:**
```
https://yourdomain.com/api/webhooks/asp-conversion
```

**Query Parameters:**
```
?asp=a8net&type=conversion
```

**Expected Response:**
- **Success**: HTTP 200 with `{"status": "success"}`
- **Validation Error**: HTTP 400 with error details
- **Server Error**: HTTP 500 with error message

**Timeout:**
- ASPs typically expect response within 5-30 seconds
- Implement async processing for long-running tasks

---

## Implementation Priority

**Last Updated:** 2025-01-05

### Phase 1: A8.net Parameter Tracking Report (Highest Priority)

✅ **Reason:** Parameter tracking feature confirmed, manual CSV workflow viable

**Current Status:**
- Technical implementation: ✅ COMPLETE (id1 + eventId parameter appending)
- CSV export verification: ⚠️ PENDING (30-minute manual check required)
- Google Sheets integration: ✅ COMPLETE
- GAS processing: ✅ COMPLETE

**Next Steps:**
1. **[CRITICAL] CSV Export Verification (30 minutes)**
   - Login to A8.net management console
   - Access Parameter Tracking Report: `https://media-console.a8.net/report/parameter#`
   - Download CSV and verify id1 column exists
   - Document column structure in `docs/dev/a8-parameter-tracking-verification.md`

2. **If CSV Verification Successful:**
   - Create operations manual for daily CSV download workflow
   - Update documentation with CSV download procedures
   - Begin production use

3. **If CSV Verification Fails:**
   - Revert to aggregate reporting only (no member-specific cashback)
   - Prioritize alternative ASPs (もしも, バリューコマース)

**Policy Risk:**
- ⚠️ "本機能はポイントサイト向けではありません" (Not for point sites)
- Consider contacting A8.net support for pre-approval
- Monitor for policy violations

**Estimated Timeline:**
- Verification: 30 minutes
- Operations manual: 1-2 hours
- **Total: Same day completion possible**

### Phase 2: afb Integration (Deferred)

⏸️ **Status:** **DEFERRED** - Vercel Cron limitations

**Deferral Reason:**
- Vercel Free Plan has insufficient Cron execution quota
- Deployment failures due to Cron restrictions
- Code has been removed to enable deployment

**Implementation Removed:**
- Type definitions (types/afb-postback.ts)
- Webhook endpoint (app/api/webhooks/afb-postback/route.ts)
- API client (lib/asp/afb-client.ts)
- Conversion matcher (lib/matching/conversion-matcher.ts)

**Re-implementation Options:**
1. **GitHub Actions Scheduler** (Free alternative)
   - Use GitHub Actions cron to trigger API polling
   - Call API endpoint with CRON_SECRET authentication
   - Estimated implementation: 2-3 hours

2. **Upgrade to Vercel Pro** (Paid solution)
   - Pro plan: 1000 Cron invocations/month
   - Cost: $20/month
   - Re-implement deleted code

3. **Postback-Only Approach** (No polling)
   - Remove API polling entirely
   - Rely solely on AFB's real-time postback system
   - No Cron required

**Current Recommendation:** Focus on A8.net first, revisit AFB after A8.net success

**Estimated Timeline:** ON HOLD - Pending A8.net completion and scheduler solution

### Phase 3: もしも & バリューコマース

⚠️ **Reason:** Unknown webhook support, requires investigation

**Tasks:**
1. Contact support teams for both ASPs
2. Assess webhook availability
3. Implement if available, otherwise defer

**Estimated Timeline:** 5-7 days (dependent on support response)

---

## Next Steps

### Immediate Actions

1. **afb Dashboard Access**
   - [ ] Login to afb advertiser dashboard
   - [ ] Download postback URL specification document
   - [ ] Obtain API keys and webhook secret
   - [ ] Test postback URL configuration

2. **A8.net Support Contact**
   - [ ] Email or contact A8.net support
   - [ ] Request postback URL / webhook documentation
   - [ ] Provide advertiser ID for technical support
   - [ ] Assess webhook availability

3. **もしもアフィリエイト Support Contact**
   - [ ] Email: kanri@moshimo.com
   - [ ] Request webhook/postback URL specifications
   - [ ] Assess API availability for advertisers

4. **バリューコマース Support Contact**
   - [ ] Login to advertiser dashboard
   - [ ] Check for webhook settings
   - [ ] Contact support if not available in dashboard

### Documentation Updates

After obtaining API specifications from each ASP:

1. Create detailed integration guides for each ASP
2. Document webhook payload formats
3. Create authentication/signature verification examples
4. Update `CLAUDE.md` with webhook implementation status

### Fallback Strategy

If webhook support is not available from any ASP:

1. **Option A:** Continue with manual CSV process
   - Improve UI for CSV upload
   - Add validation and error handling
   - Automate as much as possible post-upload

2. **Option B:** ASP API Polling (if available)
   - Implement scheduled polling of ASP APIs
   - Fetch conversion data periodically (e.g., every 10 minutes)
   - Pseudo-real-time updates

3. **Option C:** Hybrid Approach
   - Use webhooks for ASPs that support them
   - Use manual CSV or polling for others
   - Unified processing logic for both methods

---

## References

- [A8.net Documents](http://document.a8.net/a8docs/)
- [afb API Integration](https://www.afi-b.com/guide/api-linkage/)
- [afb Real-time Postback](https://www.afi-b.com/guide/realtime-postback/)
- [もしもアフィリエイト Advertiser Portal](https://af.moshimo.com/af/www/merchant)
- [バリューコマース Advertiser Portal](https://www.valuecommerce.ne.jp/ecsite/)

---

**Document Status:** Updated - A8.net prioritized, AFB deferred due to Vercel Cron limitations

**Last Reviewed:** 2025-01-05
**Last Updated:** 2025-01-05 (AFB implementation removed, A8.net set as primary target)
