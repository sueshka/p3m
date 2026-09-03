import { HOME } from '../config/content';
import { gradient, radius, shadow } from '../styles/tokens';
import { Logo } from './Logo';
import { PrimaryCTA } from './PrimaryCTA';

interface HeroProps {
  /** Members see their status here and a way through to the community. */
  isMember?: boolean;
  onJoin: () => void;
}

/**
 * The charcoal hero card: burgundy bloom, glass logo tile, headline and
 * the primary conversion CTA.
 */
export function Hero({ isMember = false, onJoin }: HeroProps) {
  return (
    <section
      style={{
        flex: '0 0 auto',
        position: 'relative',
        borderRadius: radius['4xl'],
        overflow: 'hidden',
        background: gradient.hero,
        padding: '22px 20px 20px',
        boxShadow: shadow.hero,
      }}
    >
      {/* Animated bloom, top-right. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          right: -110,
          top: -130,
          borderRadius: 999,
          background: gradient.glowStrong,
          animation: 'pcGlow 12s ease-in-out infinite',
        }}
      />
      {/* Static counter-glow, bottom-left. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          left: -90,
          bottom: -120,
          borderRadius: 999,
          background: gradient.glowSoft,
        }}
      />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={34} inset={5} variant="glass" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            {HOME.heroEyebrow}
          </span>
          {isMember && (
            <span
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.22)',
                padding: '5px 10px',
                borderRadius: radius.pill,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: '#5FD08A',
                }}
              />
              {HOME.heroMemberBadge}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 27,
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              textWrap: 'balance',
            }}
          >
            {HOME.heroTitle}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14.5,
              lineHeight: 1.4,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.68)',
              textWrap: 'pretty',
            }}
          >
            {HOME.heroSubtitle}
          </p>
        </div>

        <PrimaryCTA
          label={isMember ? HOME.heroCtaMember : HOME.heroCta}
          onClick={onJoin}
          variant="light"
        />
      </div>
    </section>
  );
}
