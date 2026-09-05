import { requireAdmin } from './_lib/admin';
import { listProfiles, getSubscription, isActive } from './_lib/store';

/**
 * GET /api/admin-users — the people who accepted consent and came in.
 *
 * Only the fields consent purpose p1 names are stored and returned: id,
 * name, @username, language, plus visit dates. Everything here is written
 * after consent, never before.
 */
export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

  const url = new URL(req.url);
  const auth = await requireAdmin(url.searchParams.get('initData') ?? '');
  if (!auth.ok) return json({ error: auth.reason }, auth.status);

  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 100, 1), 500);

  try {
    const profiles = await listProfiles(limit);

    // Membership is looked up per profile so the list can show who pays.
    // Bounded by `limit`, so this stays a fixed handful of reads.
    const users = await Promise.all(
      profiles.map(async (p) => {
        let member = false;
        try {
          member = isActive(await getSubscription(p.telegramId));
        } catch {
          /* a storage hiccup should not blank the whole list */
        }
        return { ...p, member };
      }),
    );

    return json({ users, count: users.length });
  } catch (err) {
    console.error('admin users failed', err);
    return json({ error: 'storage unavailable' }, 503);
  }
}
