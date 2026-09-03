/**
 * Consent state, stored per Telegram user.
 *
 * The Kyrgyz Digital Code requires consent to be given per purpose, and
 * the fact and time of consent to be recorded. There is no backend yet,
 * so this persists locally; when a backend exists, mirror these records
 * server-side — local storage is not an auditable record.
 */

/** Purposes from the consent document. 1-4 are required, 5 is optional. */
export const CONSENT_PURPOSES = ['p1', 'p2', 'p3', 'p4', 'p5'] as const;
export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];

/**
 * Purposes without which the app cannot be used. The screen presents them
 * as a single item covering data processing; keep this in step with
 * CONSENT_PURPOSE_ROWS in config/legal.ts.
 */
export const REQUIRED_PURPOSES: ConsentPurpose[] = ['p1'];

/** Bump when the documents change materially: consent is asked again. */
export const CONSENT_VERSION = 2;

export interface ConsentRecord {
  version: number;
  /** ISO timestamp of when consent was given. */
  acceptedAt: string;
  /** Telegram user id, when available. */
  userId?: number;
  granted: Record<ConsentPurpose, boolean>;
}

const KEY = 'pc_consent_v1';

function storageKey(userId?: number): string {
  return userId ? `${KEY}_${userId}` : KEY;
}

export function loadConsent(userId?: number): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    // A record from an older document revision no longer counts.
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(
  granted: Record<ConsentPurpose, boolean>,
  userId?: number,
): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    acceptedAt: new Date().toISOString(),
    userId,
    granted,
  };
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(record));
  } catch {
    /* private mode or blocked storage — the session still proceeds */
  }
  return record;
}

export function clearConsent(userId?: number): void {
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    /* nothing to do */
  }
}

/** True when every required purpose has been agreed to. */
export function hasRequiredConsent(record: ConsentRecord | null): boolean {
  if (!record) return false;
  return REQUIRED_PURPOSES.every((p) => record.granted[p]);
}
