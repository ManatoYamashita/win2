/**
 * Google Tag Manager (GTM) Type Definitions
 *
 * Provides type safety for GTM dataLayer events used in WIN×Ⅱ.
 * All events follow GA4 event naming conventions (snake_case).
 *
 * @module types/gtm.d.ts
 */

/**
 * Base GTM event interface
 * All custom events must include 'event' property for GTM tag triggers
 */
export interface GTMEvent {
  event: string;
  [key: string]: unknown;
}

/**
 * User sign-up event (会員登録完了)
 *
 * Triggered when a new user successfully completes registration.
 * Maps to GA4 'sign_up' event for tracking user acquisition.
 *
 * @example
 * ```typescript
 * const signUpEvent: GTMSignUpEvent = {
 *   event: "sign_up",
 *   user_id: "123e4567-e89b-12d3-a456-426614174000",
 *   method: "email",
 *   timestamp: "2025-01-14T10:30:00.000Z"
 * };
 * window.dataLayer.push(signUpEvent);
 * ```
 */
export interface GTMSignUpEvent extends GTMEvent {
  event: "sign_up";
  user_id: string; // Member ID (UUID)
  method: "email"; // Registration method (currently only email)
  timestamp: string; // ISO 8601 format
}

/**
 * Deal click event (案件クリックイベント)
 *
 * Triggered when a user clicks on an affiliate deal CTA button.
 * Tracks conversion attribution with unique tracking IDs.
 *
 * @example
 * ```typescript
 * const dealClickEvent: GTMDealClickEvent = {
 *   event: "deal_click",
 *   deal_id: "insurance-medical-001",
 *   deal_name: "医療保険無料相談",
 *   asp_name: "A8.net",
 *   tracking_id: "123e4567-e89b-12d3-a456-426614174000",
 *   event_id: "987fcdeb-51a2-43c1-9876-fedcba098765",
 *   is_member: true,
 *   timestamp: "2025-01-14T10:35:00.000Z"
 * };
 * window.dataLayer.push(dealClickEvent);
 * ```
 */
export interface GTMDealClickEvent extends GTMEvent {
  event: "deal_click";
  deal_id: string; // microCMS deal ID
  deal_name: string; // Deal name (display)
  asp_name: string; // ASP provider (A8.net, AFB, etc.)
  tracking_id: string; // WIN×Ⅱ tracking ID (memberId or guest:UUID)
  event_id: string; // Unique event UUID
  is_member: boolean; // Whether user is authenticated member
  timestamp: string; // ISO 8601 format
}

/**
 * Union type of all GTM events
 * Use this for type-safe dataLayer.push() calls
 */
export type GTMEventType = GTMSignUpEvent | GTMDealClickEvent;

/**
 * Global window extension for dataLayer
 * Allows TypeScript to recognize window.dataLayer
 */
declare global {
  interface Window {
    dataLayer: GTMEventType[];
  }
}

export {};
