import { createHmac } from 'node:crypto';

/**
 * Verifies Telegram's `initData` signature.
 *
 * This is the only thing standing between a paying member and anyone who
 * types a user id into a request, so it must run on the server — never
 * trust `initDataUnsafe` from the client for access decisions.
 *
 * Algorithm per Telegram docs: secret = HMAC_SHA256("WebAppData", token),
 * then compare HMAC_SHA256(secret, dataCheckString) with the `hash` field.
 */
export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

const MAX_AGE_SECONDS = 24 * 60 * 60;

export function verifyInitData(
  initData: string,
  botToken: string,
): { ok: true; user: TelegramUser } | { ok: false; reason: string } {
  if (!initData) return { ok: false, reason: 'missing initData' };
  if (!botToken) return { ok: false, reason: 'server misconfigured' };

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return { ok: false, reason: 'missing hash' };

  params.delete('hash');
  const dataCheckString = [...params.entries()]
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n');

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = createHmac('sha256', secret).update(dataCheckString).digest('hex');

  // Constant-time-ish compare: lengths are fixed hex, so a plain !== is
  // acceptable here, but keep the shape explicit.
  if (computed.length !== hash.length || computed !== hash) {
    return { ok: false, reason: 'bad signature' };
  }

  // Reject stale payloads so a leaked initData cannot be replayed forever.
  const authDate = Number(params.get('auth_date') ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SECONDS) {
    return { ok: false, reason: 'expired' };
  }

  try {
    const user = JSON.parse(params.get('user') ?? 'null') as TelegramUser | null;
    if (!user?.id) return { ok: false, reason: 'no user' };
    return { ok: true, user };
  } catch {
    return { ok: false, reason: 'bad user payload' };
  }
}
