import { setSubscription, clearSubscription, getSubscription } from './_lib/store';
import { fetchExpiry, fetchSubscribers } from './_lib/tribute';

/**
 * POST /api/admin-grant — grant, inspect or revoke access by hand.
 *
 * The webhook only fires on an event, so it cannot help anyone who paid
 * before it existed, or whose event was lost while the endpoint was down.
 * This is the manual way in.
 *
 * Guarded by ADMIN_SECRET in an `x-admin-secret` header. Anyone holding
 * that value can hand out access, so keep it out of the client bundle.
 *
 *   grant:    {"telegramId": 123, "days": 30}
 *   grant:    {"telegramId": 123, "expiresAt": "2026-12-01T00:00:00Z"}
 *   check:    {"telegramId": 123, "action": "check"}
 *   revoke:   {"telegramId": 123, "action": "revoke"}
 *   backfill: {"action": "backfill"}  — import every active Tribute
 *             subscriber into KV; also diagnoses TRIBUTE_API_KEY.
 */
export const config = { runtime: 'edge' };

interface GrantRequest {
  telegramId?: number | string;
  days?: number;
  expiresAt?: string;
  action?: 'grant' | 'check' | 'revoke' | 'backfill';
}

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405);
  }

  const secret = process.env.ADMIN_SECRET ?? '';
  const given = req.headers.get('x-admin-secret') ?? '';
  // Length check first: comparing different lengths would exit early anyway.
  if (!secret || given.length !== secret.length) {
    return json({ error: 'forbidden' }, 403);
  }
  let diff = 0;
  for (let i = 0; i < secret.length; i++) {
    diff |= secret.charCodeAt(i) ^ given.charCodeAt(i);
  }
  if (diff !== 0) {
    return json({ error: 'forbidden' }, 403);
  }

  const raw = await req.text();
  if (!raw.trim()) {
    return json({ error: 'empty body — the -d argument did not arrive' }, 400);
  }
  let body: GrantRequest;
  try {
    body = JSON.parse(raw) as GrantRequest;
  } catch {
    return json({ error: 'bad json', received: raw.slice(0, 200) }, 400);
  }

  const action = body.action ?? 'grant';

  // Backfill is the only action that works on everyone at once, so it takes
  // no telegramId and must be handled before that field is required.
  if (action === 'backfill') {
    try {
      const subscribers = await fetchSubscribers();
      const imported: number[] = [];
      const skipped: number[] = [];
      for (const s of subscribers) {
        const id = Number(s.telegramUserId);
        // `pre_cancelled` keeps its paid time; `cancelled` does not.
        const usable =
          id && s.status !== 'cancelled' && s.expireAt &&
          new Date(s.expireAt).getTime() > Date.now();
        if (!usable) {
          if (id) skipped.push(id);
          continue;
        }
        await setSubscription(id, {
          expiresAt: s.expireAt,
          orderId: 'tribute-backfill',
          updatedAt: new Date().toISOString(),
        });
        imported.push(id);
      }
      return json({ total: subscribers.length, imported, skipped });
    } catch (err) {
      console.error('backfill failed', err);
      return json({ error: err instanceof Error ? err.message : 'backfill failed' }, 500);
    }
  }

  const telegramId = Number(body.telegramId);
  if (!telegramId || !Number.isFinite(telegramId)) {
    return json({ error: 'telegramId required' }, 400);
  }

  try {
    if (action === 'check') {
      // Report both sources: what we stored, and what Tribute says right
      // now. `tribute` failing while `subscription` is null is exactly the
      // state where a paying member gets shown the join wall.
      const stored = await getSubscription(telegramId);
      let tribute: unknown;
      try {
        tribute = { expiresAt: await fetchExpiry(telegramId) };
      } catch (err) {
        tribute = { error: err instanceof Error ? err.message : String(err) };
      }
      return json({
        telegramId,
        subscription: stored,
        tributeApiKeySet: Boolean(process.env.TRIBUTE_API_KEY),
        tribute,
      });
    }

    if (action === 'revoke') {
      await clearSubscription(telegramId);
      return json({ telegramId, revoked: true });
    }

    const expiresAt =
      body.expiresAt ??
      new Date(Date.now() + (body.days ?? 30) * 86_400_000).toISOString();
    if (Number.isNaN(new Date(expiresAt).getTime())) {
      return json({ error: 'bad expiresAt' }, 400);
    }

    await setSubscription(telegramId, {
      expiresAt,
      orderId: 'manual',
      updatedAt: new Date().toISOString(),
    });
    return json({ telegramId, expiresAt, granted: true });
  } catch (err) {
    console.error('admin-grant failed', err);
    return json({ error: 'storage error' }, 500);
  }
}
