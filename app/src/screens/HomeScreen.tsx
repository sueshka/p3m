import {
  BENEFITS,
  BENEFITS_SECTION,
  COMPARE,
  HOME,
  MATERIALS,
  MATERIALS_SECTION,
  type Material,
} from '../config/content';
import { color } from '../styles/tokens';
import { BeforeAfter } from '../components/BeforeAfter';
import { BenefitRow } from '../components/BenefitRow';
import { Avatar } from '../components/Avatar';
import { Hero } from '../components/Hero';
import { MaterialCard } from '../components/MaterialCard';
import { MembershipCard } from '../components/MembershipCard';
import { SectionHeading } from '../components/SectionHeading';

interface HomeScreenProps {
  /** Telegram first name, or the fallback when unavailable. */
  greetingName: string;
  photoUrl?: string;
  onJoin: () => void;
  onOpenMaterial: (material: Material) => void;
}

/**
 * Home: hero → community value → proof → membership → free materials →
 * closing CTA. The paid community is restated three times, never in the
 * same words.
 */
export function HomeScreen({
  greetingName,
  photoUrl,
  onJoin,
  onOpenMaterial,
}: HomeScreenProps) {
  return (
    <div
      className="pc-scroll"
      style={{
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '18px 16px 132px',
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {HOME.greeting} <span style={{ color: color.faint }}>{greetingName}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: color.muted }}>
            {HOME.greetingSub}
          </div>
        </div>
        <Avatar photoUrl={photoUrl} name={greetingName} size={46} inset={6} />
      </header>

      <Hero onJoin={onJoin} />

      {/* Pulled up against the hero so the two read as one unit. */}
      <div
        style={{
          marginTop: -18,
          display: 'flex',
          alignItems: 'baseline',
          // Wraps to a second line on narrow phones rather than clipping.
          flexWrap: 'wrap',
          rowGap: 2,
          columnGap: 10,
          padding: '0 4px',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            flex: '0 0 auto',
            alignSelf: 'center',
            background: color.burgundy,
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
          {HOME.tickerStrong}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: color.faint }}>
          {HOME.tickerMuted}
        </span>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionHeading title={BENEFITS_SECTION.title} meta={BENEFITS_SECTION.meta} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BENEFITS.map((benefit) => (
            <BenefitRow key={benefit.index} {...benefit} />
          ))}
        </div>
      </section>

      <section
        style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <SectionHeading title={COMPARE.title} meta={COMPARE.meta} />
        <BeforeAfter />
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.45,
            color: color.inkSoft,
            fontWeight: 500,
            padding: '0 2px',
            textWrap: 'pretty',
          }}
        >
          {COMPARE.caption}
        </p>
      </section>

      <MembershipCard onJoin={onJoin} />

      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SectionHeading title={MATERIALS_SECTION.title} meta={MATERIALS_SECTION.meta} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MATERIALS.map((material) => (
            <MaterialCard key={material.id} material={material} onOpen={onOpenMaterial} />
          ))}
        </div>
      </section>

    </div>
  );
}
