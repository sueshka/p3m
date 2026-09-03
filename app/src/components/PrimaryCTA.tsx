import type { CSSProperties } from 'react';
import { color, radius, shadow } from '../styles/tokens';
import { Pressable } from './Pressable';

type CTAVariant = 'light' | 'glass' | 'burgundy';

interface PrimaryCTAProps {
  label: string;
  onClick: () => void;
  variant?: CTAVariant;
  height?: number;
  fontSize?: number;
  style?: CSSProperties;
}

const VARIANTS: Record<CTAVariant, CSSProperties> = {
  /** White pill on a dark card — the hero's main action. */
  light: { background: color.white, color: color.ink, boxShadow: shadow.ctaLight },
  /** Translucent white on dark burgundy. */
  glass: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: color.ink,
  },
  /** Solid burgundy on a light surface. */
  burgundy: {
    background: color.burgundy,
    color: color.white,
    boxShadow: shadow.ctaBurgundy,
  },
};

/** The single conversion button, in its three surface treatments. */
export function PrimaryCTA({
  label,
  onClick,
  variant = 'light',
  height = 54,
  fontSize = 16,
  style,
}: PrimaryCTAProps) {
  return (
    <Pressable
      onClick={onClick}
      style={{
        width: '100%',
        height,
        borderRadius: radius.pill,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontSize,
        fontWeight: 700,
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {label}
    </Pressable>
  );
}
