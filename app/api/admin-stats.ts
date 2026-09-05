import { requireAdmin } from './_lib/admin';
import {
  countChats,
  countDeadChats,
  countConsentLog,
  countSubscriptions,
} from './_lib/store';

/**
 * GET /api/admin-stats — numbers for the admin tab.
 *
 * Admin-only, verified server-side: the hidden tab in the client is
 * convenience, this is the actual gate.
 */
export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

  const initData = new URL(req.url).searchParams.get('initData') ?? '';
  const auth = await requireAdmin(initData);
  if (!auth.ok) return json({ error: auth.reason }, auth.status);

  try {
    const [chats, dead, consents, subs] = await Promise.all([
      countChats(),
      countDeadChats(),
      countConsentLog(),
      countSubscriptions(),
    ]);

    return json({
      chats,
      dead,
      consents,
      activeSubscriptions: subs.active,
      expiredSubscriptions: subs.expired,
    });
  } catch (err) {
    console.error('admin stats failed', err);
    return json({ error: 'storage unavailable' }, 503);
  }
}
