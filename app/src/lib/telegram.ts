/**
 * Thin, defensive wrapper around the Telegram WebApp SDK.
 *
 * Every call degrades gracefully so the app also runs in a plain browser
 * during development — nothing here assumes Telegram is present.
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  /** Raw signed payload — the only form the server will trust. */
  initData?: string;
  initDataUnsafe?: { user?: TelegramUser };
  themeParams?: Record<string, string>;
  viewportStableHeight?: number;
  isExpanded?: boolean;
  BackButton?: {
    show(): void;
    hide(): void;
    onClick(cb: () => void): void;
    offClick(cb: () => void): void;
  };
  HapticFeedback?: {
    impactOccurred(style: HapticStyle): void;
    selectionChanged(): void;
  };
  openLink?(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink?(url: string): void;
  /** Bot API 8.0+. Saves a file without leaving the mini app. */
  downloadFile?(
    params: { url: string; file_name: string },
    callback?: (accepted: boolean) => void,
  ): void;
  setHeaderColor?(color: string): void;
  setBackgroundColor?(color: string): void;
  onEvent?(event: string, cb: () => void): void;
  offEvent?(event: string, cb: () => void): void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function tg(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

export const isTelegram = (): boolean => tg() !== null;

/** Fires a light impact where supported; a no-op everywhere else. */
export function haptic(style: HapticStyle = 'light'): void {
  tg()?.HapticFeedback?.impactOccurred(style);
}

export function selectionHaptic(): void {
  tg()?.HapticFeedback?.selectionChanged();
}

/**
 * Opens a URL through the best available channel: Telegram's in-app
 * browser for t.me links, the external opener otherwise, and a plain
 * window.open when running outside Telegram.
 */
export function openLink(url: string): void {
  haptic('medium');
  const app = tg();
  if (app?.openTelegramLink && url.includes('t.me')) {
    app.openTelegramLink(url);
    return;
  }
  if (app?.openLink) {
    app.openLink(url);
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Saves a file to the device from inside the mini app.
 *
 * `downloadFile` (Bot API 8.0) shows Telegram's own save prompt and keeps
 * the user in the app. Older clients do not have it, so those fall back to
 * `openLink`, which hands off to the browser as before — degraded, but
 * never a dead end.
 *
 * Returns true when the native path was used, so callers can tailor the
 * hint they show.
 */
export function downloadFile(url: string, fileName: string): boolean {
  const app = tg();
  if (app?.downloadFile) {
    haptic('medium');
    app.downloadFile({ url, file_name: fileName });
    return true;
  }
  // openLink fires its own haptic.
  openLink(url);
  return false;
}

/** True when this client can save files without leaving the app. */
export const canDownloadInApp = (): boolean => Boolean(tg()?.downloadFile);

/** Called once on mount: signals readiness and expands to full height. */
export function initTelegram(): void {
  const app = tg();
  if (!app) return;
  try {
    app.ready();
    app.expand();
    app.setHeaderColor?.('#FFFFFF');
    app.setBackgroundColor?.('#FFFFFF');
  } catch {
    /* older clients may not expose every method — safe to ignore */
  }
}

export function getTelegramUser(): TelegramUser | null {
  return tg()?.initDataUnsafe?.user ?? null;
}

/**
 * Shows the native Back button while `visible`, routing taps to `onBack`.
 * Returns a cleanup function for use in an effect.
 */
export function bindBackButton(visible: boolean, onBack: () => void): () => void {
  const button = tg()?.BackButton;
  if (!button) return () => {};
  button.onClick(onBack);
  if (visible) button.show();
  else button.hide();
  return () => {
    button.offClick(onBack);
    button.hide();
  };
}

export function closeApp(): void {
  const app = tg();
  if (app) app.close();
}
