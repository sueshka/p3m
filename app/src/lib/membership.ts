/**
 * Membership status, resolved on the server.
 *
 * The client never decides this on its own: it forwards Telegram's signed
 * `initData` and trusts only the server's answer. Anything else could be
 * faked from the browser console.
 */
import { tg } from './telegram';

export type MembershipState =
  | { status: 'loading' }
  | { status: 'member'; expiresAt: string | null }
  | { status: 'guest' }
  /** Server unreachable or not configured — treated as no access. */
  | { status: 'unknown' };

const ENDPOINT = '/api/membership';

export async function fetchMembership(): Promise<MembershipState> {
  const initData = tg()?.initData;
  if (!initData) return { status: 'guest' };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    });
    if (!res.ok) return res.status === 401 ? { status: 'guest' } : { status: 'unknown' };
    const data = (await res.json()) as { isMember?: boolean; expiresAt?: string | null };
    return data.isMember
      ? { status: 'member', expiresAt: data.expiresAt ?? null }
      : { status: 'guest' };
  } catch {
    return { status: 'unknown' };
  }
}
