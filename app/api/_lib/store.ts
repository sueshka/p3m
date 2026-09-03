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

/** True when a stored subscription has not yet expired. */
export function isActive(sub: Subscription | null): boolean {
  if (!sub?.expiresAt) return false;
  return new Date(sub.expiresAt).getTime() > Date.now();
}
