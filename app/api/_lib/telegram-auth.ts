/**
 * Verifies Telegram's `initData` signature.
 *
 * This is the only thing standing between a paying member and anyone who
 * types a user id into a request, so it must run on the server — never
 * trust `initDataUnsafe` from the client for access decisions.
 *
 * Algorithm per Telegram docs: secret = HMAC_SHA256("WebAppData", token),
 * then compare HMAC_SHA256(secret, dataCheckString) with the `hash` field.
 *
 * Uses Web Crypto so this runs on the Edge runtime.
 */
export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

const MAX_AGE_SECONDS = 24 * 60 * 60;

async function hmac(key: ArrayBuffer | string, message: string): Promise<ArrayBuffer> {
  const raw = typeof key === 'string' ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    raw,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyInitData(
  initData: string,
  botToken: string,
): Promise<{ ok: true; user: TelegramUser } | { ok: false; reason: string }> {
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

  const secret = await hmac('WebAppData', botToken);
  const computed = toHex(await hmac(secret, dataCheckString));

  // Constant-time compare, matching the webhook and admin handlers.
  if (computed.length !== hash.length) {
    return { ok: false, reason: 'bad signature' };
  }
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  if (diff !== 0) {
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
