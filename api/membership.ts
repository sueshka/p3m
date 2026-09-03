import { verifyInitData } from './_lib/telegram-auth';
import { getSubscription, isActive } from './_lib/store';

/**
 * GET/POST /api/membership — tells the Mini App whether this user has an
 * active subscription.
 *
 * The client sends its raw `initData`; the signature is verified here, so
 * the answer cannot be forged by editing the request.
 */
export const config = { runtime: 'nodejs' };

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

  const check = verifyInitData(initData, process.env.TELEGRAM_BOT_TOKEN ?? '');
  if (!check.ok) {
    return json({ isMember: false, error: check.reason }, 401);
  }

  try {
    const sub = await getSubscription(check.user.id);
    return json({
      isMember: isActive(sub),
      expiresAt: sub?.expiresAt ?? null,
    });
  } catch (err) {
    // Storage trouble must not silently grant access.
    console.error('membership lookup failed', err);
    return json({ isMember: false, error: 'storage unavailable' }, 503);
  }
}
