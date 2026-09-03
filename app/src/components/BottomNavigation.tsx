import { NAV } from '../config/content';
import { color, glass, gradient, radius, shadow } from '../styles/tokens';
import { Pressable } from './Pressable';

export type Tab = 'home' | 'account';

interface BottomNavigationProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const INACTIVE = '#9B959D';

function HomeIcon({ tint }: { tint: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 17,
        height: 16,
        borderRadius: 5,
        border: `2px solid ${tint}`,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '1.5px 1.5px 0 0', background: tint }} />
    </span>
  );
}

function AccountIcon({ tint, active }: { tint: string; active: boolean }) {
  // The active pill uses a marginally smaller mark so the icon reads at
  // the same weight next to its label.
  const head = active ? 8 : 9;
  const body = active ? { w: 15, h: 7 } : { w: 17, h: 8 };
  return (
    <span
      aria-hidden
      style={{
        width: 22,
        height: 22,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: active ? 'center' : undefined,
        gap: 2,
      }}
    >
      <span style={{ width: head, height: head, borderRadius: 999, background: tint }} />
      <span
        style={{ width: body.w, height: body.h, borderRadius: '9px 9px 0 0', background: tint }}
      />
    </span>
  );
}

/**
 * Floating glass pill navigation. The selected item becomes a solid
 * near-black pill with its label; the other collapses to an icon.
 */
export function BottomNavigation({ active, onChange }: BottomNavigationProps) {
  const isHome = active === 'home';

  const activePill = {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    height: 48,
    padding: '0 22px 0 18px',
    borderRadius: radius.pill,
    background: color.ink,
    color: color.white,
    fontSize: 15,
    fontWeight: 700,
  } as const;

  const iconOnly = {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const;

  return (
    <nav
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: `0 16px calc(22px + var(--pc-safe-bottom))`,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        background: gradient.navScrim,
        zIndex: 20,
      }}
    >
      <div
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: 7,
          borderRadius: radius.pill,
          background: glass.nav,
          backdropFilter: glass.blurNav,
          WebkitBackdropFilter: glass.blurNav,
          border: '1px solid rgba(12,11,13,0.07)',
          boxShadow: shadow.nav,
        }}
      >
        <Pressable
          onClick={() => onChange('home')}
          aria-label={NAV.home}
          aria-current={isHome ? 'page' : undefined}
          style={isHome ? activePill : iconOnly}
        >
          <HomeIcon tint={isHome ? color.white : INACTIVE} />
          {isHome && NAV.home}
        </Pressable>

        <Pressable
          onClick={() => onChange('account')}
          aria-label={NAV.account}
          aria-current={!isHome ? 'page' : undefined}
          style={!isHome ? activePill : iconOnly}
        >
          <AccountIcon tint={!isHome ? color.white : INACTIVE} active={!isHome} />
          {!isHome && NAV.account}
        </Pressable>
      </div>
    </nav>
  );
}
