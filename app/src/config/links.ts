/**
 * Every outbound URL in the app lives here — nothing is hardcoded in a
 * component. Swap these for the real destinations before shipping.
 *
 * Values can be overridden at build time via Vite env vars so staging and
 * production can point at different Tribute flows without a code change.
 */
const env = import.meta.env;

export const LINKS = {
  /** Tribute purchase / subscription flow — the primary conversion target. */
  TRIBUTE_PURCHASE_URL:
    env.VITE_TRIBUTE_URL ??
    'https://t.me/tribute/app?startapp=ep_8xrKpPLt8E6WFnwDLt4QzePG5218Pm3JvSmktSJnRibsC2tbNM',
  OVERLAYS_URL: env.VITE_OVERLAYS_URL ?? 'https://t.me/pocketcreator',
  LUTS_URL: env.VITE_LUTS_URL ?? 'https://t.me/pocketcreator',
  OPEN_GATE_URL: env.VITE_OPEN_GATE_URL ?? 'https://t.me/pocketcreator',
  SUPPORT_URL: env.VITE_SUPPORT_URL ?? 'https://t.me/pocketcreator',
  /** Opened by the member-state "Открыть комьюнити" button. */
  COMMUNITY_URL: env.VITE_COMMUNITY_URL ?? 'https://t.me/pocketcreator',
} as const;

export type LinkKey = keyof typeof LINKS;
