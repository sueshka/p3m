/**
 * Admin data and actions.
 *
 * The id list here only decides whether the tab is drawn. It is not a
 * security boundary — this file ships to every user — so each endpoint
 * re-checks the caller's signed `initData` server-side. Keep this list in
 * step with ADMIN_TELEGRAM_IDS in the environment.
 */
import { tg } from './telegram';

const ADMIN_IDS = [768346848];

export function isAdmin(userId?: number): boolean {
  return typeof userId === 'number' && ADMIN_IDS.includes(userId);
}

export interface AdminStats {
  chats: number;
  dead: number;
  consents: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
}

export async function fetchAdminStats(): Promise<AdminStats | null> {
  const initData = tg()?.initData;
  if (!initData) return null;

  try {
    const res = await fetch(`/api/admin-stats?initData=${encodeURIComponent(initData)}`);
    if (!res.ok) return null;
    return (await res.json()) as AdminStats;
  } catch {
    return null;
  }
}

export interface AdminUser {
  telegramId: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  firstSeen: string;
  lastSeen: string;
  visits: number;
  member: boolean;
}

export async function fetchAdminUsers(): Promise<AdminUser[] | null> {
  const initData = tg()?.initData;
  if (!initData) return null;

  try {
    const res = await fetch(`/api/admin-users?initData=${encodeURIComponent(initData)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { users?: AdminUser[] };
    return data.users ?? [];
  } catch {
    return null;
  }
}

export interface BroadcastProgress {
  sent: number;
  failed: number;
  blocked: number;
  total: number;
}

/**
 * Sends `text` to every recorded chat, one batch per request.
 *
 * The server caps each call so it finishes inside the Edge time limit; this
 * walks the offset until it reports done, reporting progress as it goes.
 */
export async function broadcast(
  text: string,
  onProgress?: (p: BroadcastProgress) => void,
): Promise<BroadcastProgress & { error?: string }> {
  const initData = tg()?.initData;
  const totals: BroadcastProgress = { sent: 0, failed: 0, blocked: 0, total: 0 };
  if (!initData) return { ...totals, error: 'no telegram session' };

  let offset = 0;
  // Guard against a server that never reports done, so a bug cannot turn
  // into an endless send loop.
  for (let guard = 0; guard < 500; guard++) {
    let res: Response;
    try {
      res = await fetch('/api/admin-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, text, offset }),
      });
    } catch {
      return { ...totals, error: 'сеть недоступна' };
    }

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      return { ...totals, error: body?.error ?? `ошибка ${res.status}` };
    }

    const data = (await res.json()) as {
      sent: number;
      failed: number;
      blocked: number;
      nextOffset: number;
      total: number;
      done: boolean;
    };

    totals.sent += data.sent;
    totals.failed += data.failed;
    totals.blocked += data.blocked;
    totals.total = data.total;
    onProgress?.({ ...totals });

    if (data.done) return totals;
    // No forward progress means the walk would spin in place.
    if (data.nextOffset <= offset) return { ...totals, error: 'рассылка застряла' };
    offset = data.nextOffset;
  }

  return { ...totals, error: 'слишком много пачек' };
}
