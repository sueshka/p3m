/**
 * Reads subscriber state straight from Tribute.
 *
 * The webhook is the normal path, but it only fires on an event. Anyone who
 * paid before the webhook existed — or during an outage that outlived
 * Tribute's retries — has nothing in KV and would look like a guest. This
 * asks Tribute directly so those people still get in.
 */
const API = 'https://tribute.tg/api/v1/subscribers';

interface Subscriber {
  telegramUserId: number;
  status: 'active' | 'pre_cancelled' | 'cancelled';
  expireAt: string;
}

/**
 * Returns the expiry for a paying user, or null when Tribute does not list
 * them. Throws if Tribute is unreachable, so a lookup failure is never
 * mistaken for "did not pay".
 */
export async function fetchExpiry(telegramId: number): Promise<string | null> {
  const key = process.env.TRIBUTE_API_KEY;
  if (!key) return null;

  const res = await fetch(API, {
    headers: { 'Api-Key': key },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    throw new Error(`Tribute API ${res.status}`);
  }

  const body = (await res.json()) as unknown;
  // Documented as a bare array; tolerate a wrapped one rather than throwing.
  const list = (Array.isArray(body) ? body : (body as { data?: unknown }).data) as
    | Subscriber[]
    | undefined;
  if (!Array.isArray(list)) {
    throw new Error('Tribute API: unexpected shape');
  }

  const found = list.find((s) => Number(s.telegramUserId) === telegramId);
  // `pre_cancelled` still has paid time left, so honour expireAt for it too.
  if (!found || found.status === 'cancelled') return null;
  return found.expireAt ?? null;
}
