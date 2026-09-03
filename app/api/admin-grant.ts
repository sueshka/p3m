import { setSubscription, clearSubscription, getSubscription } from './_lib/store';

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
 *   grant:  {"telegramId": 123, "days": 30}
 *   grant:  {"telegramId": 123, "expiresAt": "2026-12-01T00:00:00Z"}
 *   check:  {"telegramId": 123, "action": "check"}
 *   revoke: {"telegramId": 123, "action": "revoke"}
 */
export const config = { runtime: 'edge' };

interface GrantRequest {
  telegramId?: number | string;
  days?: number;
  expiresAt?: string;
  action?: 'grant' | 'check' | 'revoke';
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

  const telegramId = Number(body.telegramId);
  if (!telegramId || !Number.isFinite(telegramId)) {
    return json({ error: 'telegramId required' }, 400);
  }

  const action = body.action ?? 'grant';

  try {
    if (action === 'check') {
      return json({ telegramId, subscription: await getSubscription(telegramId) });
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
