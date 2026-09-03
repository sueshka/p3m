/**
 * Pocket Creator design tokens.
 *
 * Values are lifted verbatim from the Claude Design prototype
 * (`Pocket Creator Mini App.dc.html`) so the build stays pixel-faithful.
 * The burgundy ramp is derived from the logo — adjust it here and it
 * propagates everywhere.
 */

export const color = {
  /** Near-black used for body copy and the active nav pill. */
  ink: '#0C0B0D',
  inkSoft: '#6E6A70',
  muted: '#8B868D',
  faint: '#A69FA8',
  ghost: '#B7B1B8',
  hairline: '#C2BCC3',

  white: '#FFFFFF',
  /** Soft grey card surface. */
  surface: '#F5F3F4',
  surfaceAlt: '#EDE9EA',
  page: '#E7E5E6',

  /** Primary burgundy — the recognisable Pocket Creator accent. */
  burgundy: '#8E1B34',
  burgundyDeep: '#5E0F22',
  burgundyBright: '#B22242',
  burgundyDark: '#37101C',

  charcoal: '#232027',
  charcoalDeep: '#121014',
} as const;

export const gradient = {
  hero: 'linear-gradient(165deg, #232027 0%, #121014 62%, #0C0B0D 100%)',
  membership: 'linear-gradient(150deg, #5E0F22 0%, #2A0B15 55%, #131015 100%)',
  logoBadge: 'linear-gradient(150deg, #8E1B34, #37101C)',
  accessLocked: 'linear-gradient(155deg, #211D22 0%, #120F13 100%)',
  accessActive: 'linear-gradient(155deg, #5E0F22 0%, #22090F 100%)',
  /** Decorative burgundy light bloom behind dark cards. */
  glowStrong:
    'radial-gradient(circle, rgba(178,34,66,0.95) 0%, rgba(94,15,34,0.55) 42%, rgba(12,11,13,0) 72%)',
  glowSoft: 'radial-gradient(circle, rgba(142,27,52,0.55) 0%, rgba(12,11,13,0) 70%)',
  glowWine: 'radial-gradient(circle, rgba(200,44,78,0.75) 0%, rgba(94,15,34,0) 70%)',
  glowWineSoft: 'radial-gradient(circle, rgba(200,44,78,0.6) 0%, rgba(12,11,13,0) 70%)',
  glowMuted: 'radial-gradient(circle, rgba(178,34,66,0.7) 0%, rgba(12,11,13,0) 70%)',
  navScrim:
    'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 55%)',
} as const;

/** Translucent surfaces + blur. Kept sparse on purpose — glass is a
 *  top layer, not a default. */
export const glass = {
  header: 'rgba(255,255,255,0.86)',
  nav: 'rgba(255,255,255,0.72)',
  onDark: 'rgba(255,255,255,0.1)',
  onDarkStrong: 'rgba(255,255,255,0.12)',
  onDarkBorder: 'rgba(255,255,255,0.16)',
  onDarkBorderStrong: 'rgba(255,255,255,0.2)',
  button: 'rgba(255,255,255,0.92)',
  blurSm: 'blur(8px)',
  blurMd: 'blur(10px)',
  blurLg: 'blur(20px)',
  blurNav: 'blur(22px) saturate(1.4)',
} as const;

export const radius = {
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '22px',
  '2xl': '24px',
  '3xl': '26px',
  '4xl': '28px',
  pill: '999px',
} as const;

export const shadow = {
  hero: '0 22px 44px -20px rgba(12,11,13,0.55)',
  membership: '0 20px 40px -18px rgba(94,15,34,0.5)',
  card: '0 8px 22px -18px rgba(12,11,13,0.4)',
  compare: '0 18px 36px -22px rgba(12,11,13,0.6)',
  nav: '0 16px 34px -14px rgba(12,11,13,0.35)',
  ctaLight: '0 10px 26px -10px rgba(0,0,0,0.6)',
  ctaBurgundy: '0 12px 26px -14px rgba(142,27,52,0.75)',
  logoBadge: '0 6px 18px rgba(142,27,52,0.28)',
  handle: '0 8px 20px -6px rgba(0,0,0,0.5)',
} as const;

export const font = {
  sans: 'Manrope, "Helvetica Neue", Helvetica, sans-serif',
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

/** Restrained motion — entrance, press feedback, ambient glow. */
export const motion = {
  press: 'transform .18s ease',
  pressScale: 'scale(0.97)',
  pressScaleSubtle: 'scale(0.985)',
  rise: 'pcRise .32s ease both',
} as const;
