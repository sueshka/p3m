/**
 * Subscription storage on Upstash Redis (Vercel KV).
 *
 * One key per member: `sub:<telegramId>` holding the ISO date the access
 * expires. That is all the app needs — who paid and until when.
 *
 * Uses the REST API directly so there is no SDK dependency; Vercel's KV
 * integration provides these two env vars automatically.
 */
const URL_ENV = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN_ENV = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export interface Subscription {
  /** ISO timestamp when access ends. */
  expiresAt: string;
  /** Tribute's subscription/order id, for support lookups. */
  orderId?: string;
  updatedAt: string;
}

function assertConfigured(): { url: string; token: string } {
  if (!URL_ENV || !TOKEN_ENV) {
    throw new Error('KV is not configured: set KV_REST_API_URL and KV_REST_API_TOKEN');
  }
  return { url: URL_ENV, token: TOKEN_ENV };
}

async function kv(command: unknown[]): Promise<unknown> {
  const { url, token } = assertConfigured();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    throw new Error(`KV request failed: ${res.status}`);
  }
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

const key = (telegramId: number | string) => `sub:${telegramId}`;

export async function getSubscription(telegramId: number): Promise<Subscription | null> {
  const raw = await kv(['GET', key(telegramId)]);
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as Subscription;
  } catch {
    return null;
  }
}

export async function setSubscription(
  telegramId: number | string,
  sub: Subscription,
): Promise<void> {
  await kv(['SET', key(telegramId), JSON.stringify(sub)]);
}

export async function clearSubscription(telegramId: number | string): Promise<void> {
  await kv(['DEL', key(telegramId)]);
}

/**
 * Bot subscribers, for broadcasts.
 *
 * Telegram does not hand out the list of people who started a bot: it can
 * only be accumulated as they arrive, so every `/start` is recorded here.
 * Anyone who pressed Start before this existed is unreachable.
 *
 * A set, so repeated `/start` from the same person stores one entry.
 */
const CHATS = 'bot:chats';
/** Chats that blocked the bot. Kept out of CHATS so sends are not wasted. */
const DEAD_CHATS = 'bot:chats:dead';

export async function rememberChat(chatId: number | string): Promise<void> {
  await kv(['SADD', CHATS, String(chatId)]);
  // Someone who blocked the bot and came back is reachable again.
  await kv(['SREM', DEAD_CHATS, String(chatId)]);
}

/** Marks a chat unreachable — Telegram answered 403 (bot blocked). */
export async function forgetChat(chatId: number | string): Promise<void> {
  await kv(['SREM', CHATS, String(chatId)]);
  await kv(['SADD', DEAD_CHATS, String(chatId)]);
}

export async function listChats(): Promise<string[]> {
  const raw = await kv(['SMEMBERS', CHATS]);
  return Array.isArray(raw) ? raw.map(String) : [];
}

export async function countChats(): Promise<number> {
  const raw = await kv(['SCARD', CHATS]);
  return typeof raw === 'number' ? raw : 0;
}

/**
 * Consent records.
 *
 * The Digital Code requires the fact and time of consent to be provable, so
 * two things are stored: `consent:<id>` holds what the person currently
 * agreed to, and `consent:log` keeps every submission ever made. Withdrawal
 * overwrites the first but must never erase the second — proof that consent
 * once existed is exactly what an audit asks for.
 */
export interface ConsentRecord {
  /** Document revision the person agreed to. */
  version: number;
  /** ISO timestamp, taken from the server clock, not the client's. */
  acceptedAt: string;
  telegramId: number;
  /** Purpose id -> agreed. */
  granted: Record<string, boolean>;
  /** Kept as evidence of where the consent came from. */
  ip?: string;
  userAgent?: string;
}

const consentKey = (telegramId: number | string) => `consent:${telegramId}`;
const CONSENT_LOG = 'consent:log';

export async function getConsentRecord(telegramId: number): Promise<ConsentRecord | null> {
  const raw = await kv(['GET', consentKey(telegramId)]);
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw) as ConsentRecord;
  } catch {
    return null;
  }
}

export async function saveConsentRecord(record: ConsentRecord): Promise<void> {
  const payload = JSON.stringify(record);
  await kv(['SET', consentKey(record.telegramId), payload]);
  // Append-only history. A failure here must not lose the record itself,
  // but it does mean the audit trail has a gap, so it is worth shouting about.
  await kv(['RPUSH', CONSENT_LOG, payload]).catch((err) =>
    console.error('consent log append failed', err),
  );
}

/** Number of chats that blocked the bot. */
export async function countDeadChats(): Promise<number> {
  const raw = await kv(['SCARD', DEAD_CHATS]);
  return typeof raw === 'number' ? raw : 0;
}

/** How many consent submissions have ever been filed. */
export async function countConsentLog(): Promise<number> {
  const raw = await kv(['LLEN', CONSENT_LOG]);
  return typeof raw === 'number' ? raw : 0;
}

/**
 * Counts stored subscriptions, split into active and lapsed.
 *
 * SCAN rather than KEYS: KEYS blocks Redis for the whole sweep, which is
 * fine at ten members and a problem at ten thousand.
 */
export async function countSubscriptions(): Promise<{ active: number; expired: number }> {
  let cursor = '0';
  let active = 0;
  let expired = 0;
  const now = Date.now();

  do {
    const page = (await kv(['SCAN', cursor, 'MATCH', 'sub:*', 'COUNT', '200'])) as
      | [string, string[]]
      | undefined;
    if (!Array.isArray(page)) break;
    cursor = String(page[0]);
    const keys = Array.isArray(page[1]) ? page[1] : [];

    if (keys.length > 0) {
      const values = (await kv(['MGET', ...keys])) as unknown[];
      for (const raw of values ?? []) {
        if (typeof raw !== 'string') continue;
        try {
          const sub = JSON.parse(raw) as Subscription;
          if (new Date(sub.expiresAt).getTime() > now) active++;
          else expired++;
        } catch {
          /* a malformed row should not abort the whole count */
        }
      }
    }
  } while (cursor !== '0');

  return { active, expired };
}

/** True when a stored subscription has not yet expired. */
export function isActive(sub: Subscription | null): boolean {
  if (!sub?.expiresAt) return false;
  return new Date(sub.expiresAt).getTime() > Date.now();
}
