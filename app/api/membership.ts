import { verifyInitData } from './_lib/telegram-auth';
import {
  getSubscription,
  setSubscription,
  isActive,
  getProfile,
  touchProfile,
} from './_lib/store';
import { fetchExpiry } from './_lib/tribute';

/**
 * GET/POST /api/membership — tells the Mini App whether this user has an
 * active subscription.
 *
 * The client sends its raw `initData`; the signature is verified here, so
 * the answer cannot be forged by editing the request.
 */
export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

  let initData = '';
  if (req.method === 'POST') {
    try {
      const body = (await req.json()) as { initData?: string };
      initData = body.initData ?? '';
    } catch {
      return json({ isMember: false, error: 'bad request' }, 400);
    }
  } else {
    initData = new URL(req.url).searchParams.get('initData') ?? '';
  }

  const check = await verifyInitData(initData, process.env.TELEGRAM_BOT_TOKEN ?? '');
  if (!check.ok) {
    return json({ isMember: false, error: check.reason }, 401);
  }

  // Every open passes through here, so this is where `lastSeen` stays
  // current — without it the retention clock would freeze at the date of
  // consent. Only refreshes an existing profile; one is created at consent.
  try {
    if (await getProfile(check.user.id)) {
      await touchProfile(check.user, check.user.language_code);
    }
  } catch (err) {
    console.error('profile touch failed', err);
  }

  try {
    const sub = await getSubscription(check.user.id);
    if (isActive(sub)) {
      return json({ isMember: true, expiresAt: sub?.expiresAt ?? null });
    }

    // Nothing stored (or it lapsed): ask Tribute before turning them away.
    // Covers members who paid before this webhook existed, and any event
    // that never reached us.
    let expiresAt: string | null = null;
    let lookupFailed = false;
    try {
      expiresAt = await fetchExpiry(check.user.id);
    } catch (err) {
      // Tribute unreachable or misconfigured. Distinguish this from a
      // confirmed "did not pay" so a paying member is not shown the
      // join wall because of our own outage.
      console.error('tribute lookup failed', err);
      lookupFailed = true;
    }

    if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
      if (lookupFailed) {
        return json({ isMember: false, error: 'verification unavailable' }, 503);
      }
      return json({ isMember: false, expiresAt: null });
    }

    // Cache it so the next open is a single KV read.
    await setSubscription(check.user.id, {
      expiresAt,
      updatedAt: new Date().toISOString(),
    }).catch((err) => console.error('backfill write failed', err));

    return json({ isMember: true, expiresAt });
  } catch (err) {
    // Storage trouble must not silently grant access.
    console.error('membership lookup failed', err);
    return json({ isMember: false, error: 'storage unavailable' }, 503);
  }
}
