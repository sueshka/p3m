import type { CSSProperties } from 'react';
import { glass, gradient, radius, shadow } from '../styles/tokens';

const LOGO_SRC = 'assets/pocket-creator-logo.png';

interface LogoProps {
  size: number;
  /** Padding between the badge edge and the mark. */
  inset?: number;
  /** `solid` = burgundy gradient badge with a knocked-out white mark.
   *  `glass` = translucent tile used on dark surfaces. */
  variant?: 'solid' | 'glass';
  radius?: string;
  alt?: string;
  style?: CSSProperties;
}

/**
 * The supplied logo, never redrawn — only wrapped in its badge.
 * The `solid` variant knocks the mark out to white via a filter so the
 * single source asset serves both treatments.
 */
export function Logo({
  size,
  inset = 6,
  variant = 'solid',
  radius: r,
  alt = '',
  style,
}: LogoProps) {
  const isSolid = variant === 'solid';
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: r ?? (isSolid ? radius.pill : radius.sm),
        background: isSolid ? gradient.logoBadge : glass.onDark,
        border: isSolid ? undefined : `1px solid ${glass.onDarkBorder}`,
        backdropFilter: isSolid ? undefined : glass.blurMd,
        WebkitBackdropFilter: isSolid ? undefined : glass.blurMd,
        boxShadow: isSolid ? shadow.logoBadge : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: inset,
        ...style,
      }}
    >
      <img
        src={LOGO_SRC}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: isSolid ? 'brightness(0) invert(1) opacity(0.92)' : undefined,
        }}
      />
    </div>
  );
}
