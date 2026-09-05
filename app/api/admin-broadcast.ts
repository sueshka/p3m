import { requireAdmin } from './_lib/admin';
import { listChats, forgetChat } from './_lib/store';

/**
 * POST /api/admin-broadcast — sends one message to every recorded chat.
 *
 * Works in batches rather than one long run: an Edge function has a time
 * limit, and a broadcast to a large list will not finish inside it. The
 * client posts `offset`, gets back the next one, and repeats until `done`.
 * That also means a stalled run can be resumed instead of restarted, which
 * matters because there is no way to un-send a duplicate.
 *
 * Telegram allows roughly 30 messages/second overall and is stricter for
 * bulk sends, so this paces itself and honours `retry_after` on 429.
 */
export const config = { runtime: 'edge' };

/** Chats per request. Conservative enough to finish inside the time limit. */
const BATCH = 25;
/** Gap between sends: ~20/s, under Telegram's limit with room to spare. */
const GAP_MS = 50;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req: Request): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  let body: { initData?: string; text?: string; offset?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return json({ error: 'bad request' }, 400);
  }

  const auth = await requireAdmin(body.initData ?? '');
  if (!auth.ok) return json({ error: auth.reason }, auth.status);

  const text = (body.text ?? '').trim();
  if (!text) return json({ error: 'empty message' }, 400);
  // Telegram's own limit; better to say so than to have every send fail.
  if (text.length > 4096) return json({ error: 'message too long' }, 400);

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('admin-broadcast: TELEGRAM_BOT_TOKEN missing');
    return json({ error: 'server misconfigured' }, 503);
  }

  let chats: string[];
  try {
    // Sorted so the offset means the same thing across requests: an
    // unsorted set could reorder between batches and skip or repeat people.
    chats = (await listChats()).sort();
  } catch (err) {
    console.error('broadcast: chat list unavailable', err);
    return json({ error: 'storage unavailable' }, 503);
  }

  const offset = Math.max(0, Number(body.offset) || 0);
  const slice = chats.slice(offset, offset + BATCH);

  let sent = 0;
  let failed = 0;
  let blocked = 0;

  for (const chatId of slice) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });

      if (res.ok) {
        sent++;
      } else if (res.status === 403) {
        // Blocked the bot: drop them so later runs are not wasted on it.
        blocked++;
        await forgetChat(chatId).catch(() => {});
      } else if (res.status === 429) {
        // Respect the wait Telegram asks for, then retry this one chat.
        const info = (await res.json().catch(() => null)) as
          | { parameters?: { retry_after?: number } }
          | null;
        const wait = Math.min((info?.parameters?.retry_after ?? 1) * 1000, 10_000);
        await sleep(wait);
        const retry = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        });
        if (retry.ok) sent++;
        else failed++;
      } else {
        failed++;
        console.error('broadcast send failed', chatId, res.status);
      }
    } catch (err) {
      failed++;
      console.error('broadcast send threw', chatId, err);
    }

    await sleep(GAP_MS);
  }

  const nextOffset = offset + slice.length;
  return json({
    sent,
    failed,
    blocked,
    nextOffset,
    total: chats.length,
    done: nextOffset >= chats.length,
  });
}
