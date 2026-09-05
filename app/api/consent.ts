import { verifyInitData } from './_lib/telegram-auth';
import { getConsentRecord, saveConsentRecord, type ConsentRecord } from './_lib/store';

/**
 * POST /api/consent — records that this user agreed, and to what.
 * GET  /api/consent — returns what they last agreed to, or null.
 *
 * Local storage cannot serve as an auditable record: the person clears it
 * and the proof is gone. This keeps the record server-side, signed by
 * Telegram's own `initData` so it names a real user rather than whoever
 * typed an id into a request.
 *
 * The timestamp is the server's. A client clock can be wrong or set on
 * purpose, and "when was consent given" is the part that has to hold up.
 */
export const config = { runtime: 'edge' };

/** Mirrors CONSENT_VERSION and CONSENT_PURPOSES in src/lib/consent.ts. */
const KNOWN_PURPOSES = ['p1', 'p2', 'p3', 'p4', 'p5'];

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

  if (req.method === 'GET') {
    const initData = new URL(req.url).searchParams.get('initData') ?? '';
    const check = await verifyInitData(initData, process.env.TELEGRAM_BOT_TOKEN ?? '');
    if (!check.ok) return json({ error: check.reason }, 401);

    try {
      return json({ record: await getConsentRecord(check.user.id) });
    } catch (err) {
      console.error('consent read failed', err);
      return json({ error: 'storage unavailable' }, 503);
    }
  }

  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }

  let body: { initData?: string; version?: number; granted?: Record<string, unknown> };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return json({ error: 'bad request' }, 400);
  }

  const check = await verifyInitData(body.initData ?? '', process.env.TELEGRAM_BOT_TOKEN ?? '');
  if (!check.ok) return json({ error: check.reason }, 401);

  const version = Number(body.version);
  if (!Number.isInteger(version) || version < 1) {
    return json({ error: 'bad version' }, 400);
  }

  // Only known purposes, only booleans: the record is evidence, so it must
  // not carry whatever the client felt like sending.
  const granted: Record<string, boolean> = {};
  for (const purpose of KNOWN_PURPOSES) {
    granted[purpose] = body.granted?.[purpose] === true;
  }

  const record: ConsentRecord = {
    version,
    acceptedAt: new Date().toISOString(),
    telegramId: check.user.id,
    granted,
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    userAgent: req.headers.get('user-agent') || undefined,
  };

  try {
    await saveConsentRecord(record);
  } catch (err) {
    console.error('consent write failed', err);
    return json({ error: 'storage unavailable' }, 503);
  }

  return json({ ok: true, acceptedAt: record.acceptedAt });
}
