/**
 * Consent state, stored per Telegram user.
 *
 * The Kyrgyz Digital Code requires consent to be given per purpose, and
 * the fact and time of consent to be recorded. The auditable record lives
 * server-side (POST /api/consent, timestamped by the server clock and tied
 * to a verified Telegram identity); local storage is only a cache, so the
 * consent screen does not reappear on every launch while the network is
 * slow or unavailable.
 */
import { tg } from './telegram';

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

/**
 * Marks whether the record still needs to reach the server. Consent is not
 * allowed to fail because the network did: the person is let through on the
 * local record, and the upload is retried on the next launch.
 */
const PENDING_KEY = 'pc_consent_pending';

function markPending(record: ConsentRecord): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(record));
  } catch {
    /* nothing we can do; the next accept will try again */
  }
}

function clearPending(): void {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Sends one record. Resolves true only when the server stored it.
 *
 * `acceptedAt` is passed only for a backfill: for a fresh accept the server
 * timestamps it itself, which is the whole point of recording server-side.
 */
async function upload(record: ConsentRecord, acceptedAt?: string): Promise<boolean> {
  const initData = tg()?.initData;
  // Outside Telegram there is no verifiable identity, so there is nothing
  // the server would be willing to record.
  if (!initData) return false;

  try {
    const res = await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        initData,
        version: record.version,
        granted: record.granted,
        ...(acceptedAt ? { acceptedAt } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Records consent server-side. Call after saveConsent; it never throws and
 * never blocks the UI — a failure just leaves the record queued.
 */
export async function syncConsent(record: ConsentRecord): Promise<void> {
  if (await upload(record)) {
    clearPending();
    markSynced(record.userId);
  } else {
    markPending(record);
  }
}

/**
 * Marks that this device's stored consent has reached the server, so the
 * backfill runs once rather than on every launch.
 */
const SYNCED_KEY = 'pc_consent_synced';

function markSynced(userId?: number): void {
  try {
    localStorage.setItem(`${SYNCED_KEY}_${userId ?? 'anon'}`, String(CONSENT_VERSION));
  } catch {
    /* worst case the upload repeats; the server overwrites the same key */
  }
}

function isSynced(userId?: number): boolean {
  try {
    return localStorage.getItem(`${SYNCED_KEY}_${userId ?? 'anon'}`) === String(CONSENT_VERSION);
  } catch {
    return false;
  }
}

/**
 * Files consent that predates this endpoint.
 *
 * People who accepted before the server started recording have their proof
 * sitting in local storage only. This carries it over on their next visit —
 * the alternative is asking them to consent again, which is worse for them
 * and loses the original date.
 */
export async function backfillConsent(userId?: number): Promise<void> {
  if (isSynced(userId)) return;
  const record = loadConsent(userId);
  if (!hasRequiredConsent(record) || !record) return;

  // The original timestamp travels with it; the server keeps it as a
  // claim rather than treating it as its own observation.
  if (await upload(record, record.acceptedAt)) markSynced(userId);
}

/** Retries a queued record. Safe to call on every launch. */
export async function flushPendingConsent(): Promise<void> {
  let record: ConsentRecord;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return;
    record = JSON.parse(raw) as ConsentRecord;
  } catch {
    clearPending();
    return;
  }
  // A record from a superseded document version is not worth re-filing:
  // the screen will ask again anyway.
  if (record.version !== CONSENT_VERSION) {
    clearPending();
    return;
  }
  if (await upload(record)) clearPending();
}

/** True when every required purpose has been agreed to. */
export function hasRequiredConsent(record: ConsentRecord | null): boolean {
  if (!record) return false;
  return REQUIRED_PURPOSES.every((p) => record.granted[p]);
}
