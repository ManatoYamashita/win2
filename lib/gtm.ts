/**
 * Google Tag Manager (GTM) Helper Functions
 *
 * Provides type-safe wrapper functions for pushing events to GTM dataLayer.
 * All events are tracked with proper error handling and console warnings.
 *
 * @module lib/gtm
 */

/**
 * Generic function to push any data to GTM dataLayer
 * @param data - Object to push to dataLayer (must include 'event' property for GTM tags)
 */
export function pushToDataLayer(data: GTMEventType): void {
  if (typeof window === "undefined") {
    console.warn("[GTM] Cannot push to dataLayer: window is undefined (SSR context)");
    return;
  }

  if (!window.dataLayer) {
    console.warn("[GTM] dataLayer is not initialized. Make sure GoogleTagManager component is loaded.");
    return;
  }

  try {
    window.dataLayer.push(data);
    console.log("[GTM] Event pushed to dataLayer:", data);
  } catch (error) {
    console.error("[GTM] Failed to push to dataLayer:", error);
  }
}

/**
 * Track user sign-up (会員登録) event
 *
 * Triggered when a new user successfully completes registration.
 *
 * @param params - Sign-up event parameters
 * @param params.memberId - Unique member identifier (UUID)
 * @param params.method - Registration method (always 'email' for current implementation)
 * @param params.timestamp - Registration timestamp (ISO 8601 format)
 *
 * @example
 * ```typescript
 * trackSignUp({
 *   memberId: "123e4567-e89b-12d3-a456-426614174000",
 *   method: "email",
 *   timestamp: "2025-01-14T10:30:00.000Z"
 * });
 * ```
 */
export function trackSignUp(params: {
  memberId: string;
  method: "email";
  timestamp: string;
}): void {
  pushToDataLayer({
    event: "sign_up",
    user_id: params.memberId,
    method: params.method,
    timestamp: params.timestamp,
  });
}

/**
 * Track affiliate deal click event (案件クリック)
 *
 * Triggered when a user clicks on a deal CTA button.
 * Records deal details, tracking IDs, and user information for conversion attribution.
 *
 * @param params - Deal click event parameters
 * @param params.dealId - microCMS deal ID
 * @param params.dealName - Deal name (display)
 * @param params.aspName - ASP provider name (A8.net, AFB, etc.)
 * @param params.trackingId - WIN×Ⅱ tracking ID (memberId or guest:UUID)
 * @param params.eventId - Unique event identifier (UUID for this click)
 * @param params.isMember - Whether user is authenticated member
 * @param params.timestamp - Click timestamp (ISO 8601 format)
 *
 * @example
 * ```typescript
 * trackDealClick({
 *   dealId: "insurance-medical-001",
 *   dealName: "医療保険無料相談",
 *   aspName: "A8.net",
 *   trackingId: "123e4567-e89b-12d3-a456-426614174000",
 *   eventId: "987fcdeb-51a2-43c1-9876-fedcba098765",
 *   isMember: true,
 *   timestamp: "2025-01-14T10:35:00.000Z"
 * });
 * ```
 */
export function trackDealClick(params: {
  dealId: string;
  dealName: string;
  aspName: string;
  trackingId: string;
  eventId: string;
  isMember: boolean;
  timestamp: string;
}): void {
  pushToDataLayer({
    event: "deal_click",
    deal_id: params.dealId,
    deal_name: params.dealName,
    asp_name: params.aspName,
    tracking_id: params.trackingId,
    event_id: params.eventId,
    is_member: params.isMember,
    timestamp: params.timestamp,
  });
}
