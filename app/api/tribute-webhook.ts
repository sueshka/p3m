import { setSubscription, clearSubscription } from './_lib/store';

/**
 * POST /api/tribute-webhook — Tribute calls this when a subscription is
 * created, renewed or cancelled.
 *
 * Every one of those events carries `expires_at`, so all three are stored
 * the same way: write the date and let access lapse when it arrives. A
 * cancellation only stops the next renewal; the time already paid for is
 * still the member's.
 *
 * Set the same secret in Tribute's dashboard and in TRIBUTE_WEBHOOK_SECRET,
 * otherwise anyone who finds this URL could grant themselves access.
 */
export const config = { runtime: 'edge' };

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

async function verifySignature(
  raw: string,
  signature: string | null,
  secret: string,
): Promise<boolean> {
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw));
  const expected = [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const got = signature.replace(/^sha256=/, '');
  if (expected.length !== got.length) return false;
  // Constant-time compare so a wrong secret leaks no timing information.
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ got.charCodeAt(i);
  }
  return diff === 0;
}

export default async function handler(req: Request): Promise<Response> {
  // A bare GET is a reachability probe; answering it changes no state.
  if (req.method === 'GET' || req.method === 'HEAD') {
    return new Response('ok', { status: 200 });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const raw = await req.text();
  const secret = process.env.TRIBUTE_WEBHOOK_SECRET ?? '';
  const signature =
    req.headers.get('trbt-signature') ??
    req.headers.get('x-tribute-signature') ??
    req.headers.get('x-signature');

  if (!(await verifySignature(raw, signature, secret))) {
    return new Response('Invalid signature', { status: 401 });
  }

  let event: TributeEvent;
  try {
    event = JSON.parse(raw) as TributeEvent;
  } catch {
    return new Response('Bad payload', { status: 400 });
  }

  const p = event.payload ?? {};
  const telegramId = p.telegram_user_id ?? p.user_id;
  if (!telegramId) {
    // Tribute's "Test Request" is a signed ping with no user in it. The
    // signature already proved it is Tribute, so treat it as a health check
    // rather than an error, or the dashboard reports the webhook as broken.
    return new Response('ok', { status: 200 });
  }

  const name = (event.name ?? event.event ?? '').toLowerCase();
  const cancelled =
    name.includes('cancel') || name.includes('expired') || p.status === 'cancelled';

  try {
    const expiresAt = p.expires_at ?? p.period_end;

    // A cancellation is not an eviction: Tribute's `expires_at` marks the end
    // of the period the member already paid for, so store that date and let
    // it lapse on its own. Deleting the record here would cut access short,
    // and would rely on the /subscribers fallback to undo the mistake on the
    // next app open — which fails if the API key is ever unavailable.
    if (cancelled && !expiresAt) {
      // No date to fall back on, so honouring the paid time is impossible.
      await clearSubscription(telegramId);
      console.warn(`tribute: cancellation for ${telegramId} had no expiry — access revoked now`);
      return new Response('ok', { status: 200 });
    }

    if (!expiresAt) {
      return new Response('No expiry in payload', { status: 400 });
    }

    // Guard against a malformed date reaching storage, matching admin-grant.
    // A NaN expiry would fail isActive() and deny access, so this fails safe
    // either way; rejecting outright keeps junk out of KV.
    if (Number.isNaN(new Date(expiresAt).getTime())) {
      return new Response('Bad expiry in payload', { status: 400 });
    }

    await setSubscription(telegramId, {
      expiresAt,
      orderId: p.subscription_id ? String(p.subscription_id) : undefined,
      updatedAt: new Date().toISOString(),
    });
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('webhook store failed', err);
    // A 500 makes Tribute retry, so a KV blip does not lose a payment.
    return new Response('storage error', { status: 500 });
  }
}
