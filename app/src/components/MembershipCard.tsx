import { MEMBERSHIP } from '../config/content';
import { font, gradient, radius, shadow } from '../styles/tokens';
import { GlassBadge } from './GlassBadge';
import { Logo } from './Logo';
import { PrimaryCTA } from './PrimaryCTA';

interface MembershipCardProps {
  onJoin: () => void;
}

/**
 * The premium centrepiece: deep burgundy gradient, glow, glass badge and
 * logo tile. Mid-page reinforcement of the single conversion goal.
 */
export function MembershipCard({ onJoin }: MembershipCardProps) {
  return (
    <section
      style={{
        flex: '0 0 auto',
        position: 'relative',
        borderRadius: radius['4xl'],
        overflow: 'hidden',
        background: gradient.membership,
        padding: '24px 22px',
        boxShadow: shadow.membership,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          left: -60,
          top: -150,
          borderRadius: 999,
          background: gradient.glowWine,
        }}
      />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <GlassBadge>{MEMBERSHIP.badge}</GlassBadge>
          <Logo size={40} inset={7} variant="glass" radius="14px" />
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 22,
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            textWrap: 'pretty',
          }}
        >
          {MEMBERSHIP.title}
        </h2>

        <p
          style={{
            margin: 0,
            fontFamily: font.mono,
            fontSize: 11.5,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {MEMBERSHIP.meta}
        </p>

        <PrimaryCTA label={MEMBERSHIP.cta} onClick={onJoin} variant="glass" height={52} />
      </div>
    </section>
  );
}
