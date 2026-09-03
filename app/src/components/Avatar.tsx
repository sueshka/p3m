import { useState } from 'react';
import type { CSSProperties } from 'react';
import { gradient, radius, shadow } from '../styles/tokens';
import { Logo } from './Logo';

interface AvatarProps {
  /** Telegram `photo_url`. Absent when the user hides it in privacy settings. */
  photoUrl?: string;
  /** Used for the alt text and the initial fallback. */
  name: string;
  size: number;
  /** Padding for the logo fallback only — a photo always fills the circle. */
  inset?: number;
  style?: CSSProperties;
}

/**
 * The user's Telegram profile picture in the burgundy badge.
 *
 * Telegram omits `photo_url` for users with a private profile, and the
 * CDN link can also fail to load, so both cases fall back to the Pocket
 * Creator mark rather than leaving an empty circle.
 */
export function Avatar({ photoUrl, name, size, inset = 6, style }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (!photoUrl || failed) {
    return <Logo size={size} inset={inset} variant="solid" alt={name} style={style} />;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: radius.pill,
        background: gradient.logoBadge,
        boxShadow: shadow.logoBadge,
        overflow: 'hidden',
        ...style,
      }}
    >
      <img
        src={photoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
