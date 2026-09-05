import { verifyInitData, type TelegramUser } from './telegram-auth';

/**
 * Admin identity check for Mini App requests.
 *
 * Hiding the admin tab in the client is a convenience, not a control: the
 * bundle ships to every user and the check is trivial to bypass. Every
 * admin endpoint must call this, so authority rests on Telegram's signature
 * over `initData` rather than on what the client claims to be.
 *
 * ADMIN_TELEGRAM_IDS is a comma-separated list. Unset means no admins:
 * failing closed, like the other verifiers here.
 */
function adminIds(): Set<string> {
  const raw = process.env.ADMIN_TELEGRAM_IDS ?? '';
  return new Set(
    raw
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

export async function requireAdmin(
  initData: string,
): Promise<{ ok: true; user: TelegramUser } | { ok: false; status: number; reason: string }> {
  const check = await verifyInitData(initData, process.env.TELEGRAM_BOT_TOKEN ?? '');
  if (!check.ok) {
    return { ok: false, status: 401, reason: check.reason };
  }

  const ids = adminIds();
  if (ids.size === 0) {
    console.error('admin check: ADMIN_TELEGRAM_IDS is not set');
    return { ok: false, status: 403, reason: 'forbidden' };
  }
  if (!ids.has(String(check.user.id))) {
    // Deliberately vague: a probe should not learn whether the id exists.
    return { ok: false, status: 403, reason: 'forbidden' };
  }

  return { ok: true, user: check.user };
}
