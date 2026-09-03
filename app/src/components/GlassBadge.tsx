import type { CSSProperties } from 'react';
import { glass, radius } from '../styles/tokens';

interface GlassBadgeProps {
  children: string;
  /** Slightly brighter treatment for the active-membership state. */
  emphasis?: boolean;
  style?: CSSProperties;
}

/** Small uppercase glass pill used on dark surfaces. */
export function GlassBadge({ children, emphasis = false, style }: GlassBadgeProps) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: emphasis ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.62)',
        background: emphasis ? glass.onDarkStrong : glass.onDark,
        border: `1px solid ${emphasis ? glass.onDarkBorderStrong : glass.onDarkBorder}`,
        backdropFilter: glass.blurSm,
        WebkitBackdropFilter: glass.blurSm,
        padding: '7px 12px',
        borderRadius: radius.pill,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
