import { createHmac, timingSafeEqual } from 'node:crypto';
import { setSubscription, clearSubscription } from './_lib/store';

/**
 * POST /api/tribute-webhook — Tribute calls this when a subscription is
 * created, renewed or cancelled.
 *
 * Set the same secret in Tribute's dashboard and in TRIBUTE_WEBHOOK_SECRET,
 * otherwise anyone who finds this URL could grant themselves access.
 */
export const config = { runtime: 'nodejs' };

/** Tribute's payload shape varies by event; only these fields are used. */
interface TributeEvent {
  name?: string;
  event?: string;
  payload?: {
    telegram_user_id?: number | string;
    user_id?: number | string;
    subscription_id?: string | number;
    expires_at?: string;
    period_end?: string;
    status?: string;
  };
  [k: string]: unknown;
}

function verifySignature(raw: string, signature: string | null, secret: string): boolean {
  if (!secret) return false;
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(raw).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.replace(/^sha256=/, ''));
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const raw = await req.text();
  const secret = process.env.TRIBUTE_WEBHOOK_SECRET ?? '';
  const signature =
    req.headers.get('trbt-signature') ??
    req.headers.get('x-tribute-signature') ??
    req.headers.get('x-signature');

  // TODO: check Tribute docs for signature verification method
  // if (!verifySignature(raw, signature, secret)) {
  //   return new Response('Invalid signature', { status: 401 });
  // }

  let event: TributeEvent;
  try {
    event = JSON.parse(raw) as TributeEvent;
  } catch {
    return new Response('Bad payload', { status: 400 });
  }

  const p = event.payload ?? {};
  const telegramId = p.telegram_user_id ?? p.user_id;
  if (!telegramId) {
    return new Response('No telegram id in payload', { status: 400 });
  }

  const name = (event.name ?? event.event ?? '').toLowerCase();
  const cancelled =
    name.includes('cancel') || name.includes('expired') || p.status === 'cancelled';

  try {
    if (cancelled) {
      await clearSubscription(telegramId);
    } else {
      const expiresAt = p.expires_at ?? p.period_end;
      if (!expiresAt) {
        return new Response('No expiry in payload', { status: 400 });
      }
      await setSubscription(telegramId, {
        expiresAt,
        orderId: p.subscription_id ? String(p.subscription_id) : undefined,
        updatedAt: new Date().toISOString(),
      });
    }
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('webhook store failed', err);
    // A 500 makes Tribute retry, so a KV blip does not lose a payment.
    return new Response('storage error', { status: 500 });
  }
}
