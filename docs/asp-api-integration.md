# ASP API Integration - Webhook/Postback URL Specifications

**Last Updated:** 2025-01-03

## Overview

This document outlines the investigation results for ASP (Affiliate Service Provider) webhook/postback URL capabilities for real-time conversion notifications. Each ASP has different levels of public API documentation and webhook support.

## Investigation Summary

| ASP | Webhook/Postback Support | Public Documentation | Status |
|-----|--------------------------|---------------------|--------|
| A8.net | ❌ **Not Available (Media Member)** | Available | ❌ **Blocked - See Details Below** |
| afb (アフィb) | ✅ Real-time Postback System | Limited (Login Required) | ✅ **Primary Implementation Target** |
| もしもアフィリエイト | ❌ Unknown | None | ⚠️ Contact Support Required |
| バリューコマース | ❌ Unknown | None | ⚠️ Contact Support Required |

---

## A8.net

### ⛔ CRITICAL LIMITATION: Media Member Management Console

**Last Verified:** 2025-01-03

**Contract Type:** Media Member (Affiliate/Publisher)
**Management Console:** Media Member Dashboard

#### 🚫 **Individual Conversion Tracking: NOT POSSIBLE**

**Root Cause:**
The A8.net **Media Member management console** does NOT provide access to individual conversion details with custom tracking parameters (id1, eventId). Media members can only access **aggregated reports**.

**Available CSV Downloads (Media Member):**

| CSV Type | Content | Custom Parameters (id1, eventId) |
|----------|---------|----------------------------------|
| Program List | Program details, monthly revenue, click counts | ❌ Not included |
| Performance Summary | Aggregated revenue by program | ❌ Not included |
| Conversion Referrer Report | URLs where conversions originated | ⚠️ Partial URL parameters only |

**Example of Downloaded CSV (Program List):**
```
広告主ID, 広告主名, プログラムID, プログラム名, 今月の報酬額, 昨日売上数, 昨日クリック数...
```
→ **No individual conversion records, No member IDs (id1), No event IDs**

#### Why This is a Problem for WIN×Ⅱ

WIN×Ⅱ requires tracking **which member** generated **which conversion** to calculate individual cashback amounts. However:

1. **Media Member Console Limitation:**
   - Only shows "total revenue from Program X"
   - Cannot identify individual transactions
   - Cannot retrieve custom tracking parameters

2. **A8.net's Design Philosophy:**
   - Affiliates need to know "how much did I earn from which program"
   - Individual purchase details belong to advertisers (privacy)
   - Media members don't need granular conversion data

#### Attempted CSV Download Locations

**Tested Menu:** "Report Download" button on top page

**Result:**
Downloaded CSV contained only program-level aggregated data, not individual conversion details.

#### Alternative Approaches (All Require Advertiser Contract)

| Approach | Description | Feasibility for Media Member |
|----------|-------------|------------------------------|
| **Advertiser Dashboard** | Access to order confirmation reports with individual details | ❌ Requires advertiser contract |
| **Session Tracking API** | Send conversion data to A8.net with custom parameters | ❌ Advertiser-only feature |
| **Webhook/Postback** | A8.net sends conversion notifications to external URL | ⚠️ Unknown if available, likely advertiser-only |

#### Impact on WIN×Ⅱ Project

**Status:** ❌ **A8.net individual conversion tracking is BLOCKED**

**Implications:**
- Cannot track which WIN×Ⅱ member generated which A8.net conversion
- Cannot calculate member-specific cashback from A8.net deals
- Manual CSV process cannot work (no member ID in available CSVs)

**Recommended Actions:**
1. ✅ **Implement afb first** (confirmed postback support)
2. ⏸️ **Contact A8.net support** (ask about media member options for custom tracking)
3. ⏸️ **Consider advertiser contract** (if business model allows)
4. ⏸️ **Use A8.net for aggregate reporting only** (total revenue tracking, not member-specific cashback)

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

### Real-time Postback System

✅ **Status:** Available

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

### Phase 1: afb Integration (Highest Priority)

✅ **Reason:** Only ASP with confirmed real-time postback system

**Tasks:**
1. Login to afb dashboard and download API documentation
2. Obtain API keys and webhook configuration
3. Implement webhook endpoint for afb
4. Test with afb's test environment

**Estimated Timeline:** 2-3 days

### Phase 2: A8.net Investigation & Resolution

❌ **Status:** **BLOCKED** - Media member console limitation confirmed

**Current Situation:**
- Contract type: Media Member (Affiliate/Publisher)
- Individual conversion tracking with custom parameters (id1, eventId) is NOT AVAILABLE
- CSV downloads only provide aggregated program-level data

**Potential Actions:**
1. **Contact A8.net Support** (Priority: Medium)
   - Ask about media member options for custom tracking
   - Inquire about alternative tracking methods
   - Request information on upgrading/changing contract type

2. **Use A8.net for Aggregate Reporting Only** (Fallback)
   - Track total revenue from A8.net deals
   - NO member-specific cashback calculation
   - Display A8.net deals without individual tracking

3. **Defer A8.net Member Tracking** (Current Recommendation)
   - Focus on afb implementation first
   - Revisit A8.net after afb success
   - Consider business model adjustments

**Estimated Timeline:** ON HOLD - Pending support response or business decision

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

**Document Status:** Updated - A8.net limitation confirmed, afb implementation prioritized

**Last Reviewed:** 2025-01-03
**Last Updated:** 2025-01-03 (A8.net media member limitation documented)
