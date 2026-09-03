import { LUTS, LUTS_SCREEN, type Lut } from '../config/luts';
import { color, font, radius, shadow } from '../styles/tokens';
import { Pressable } from '../components/Pressable';

interface LutsScreenProps {
  onClose: () => void;
  onOpen: (lut: Lut) => void;
}

/** Full-screen gallery of the free LUT pack. */
export function LutsScreen({ onClose, onOpen }: LutsScreenProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: color.white,
        display: 'flex',
        flexDirection: 'column',
        animation: 'pcRise .28s ease both',
      }}
    >
      <header
        style={{
          flex: '0 0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(12,11,13,0.06)',
          background: color.white,
          zIndex: 2,
        }}
      >
        <Pressable
          onClick={onClose}
          aria-label="Назад"
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            flex: '0 0 auto',
            background: color.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            color: color.ink,
          }}
        >
          ‹
        </Pressable>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>LUTs</span>
      </header>

      <div
        className="pc-scroll"
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: `18px 16px calc(32px + var(--pc-safe-bottom))`,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span
            style={{
              fontFamily: font.mono,
              fontSize: 9.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: color.burgundy,
            }}
          >
            {LUTS_SCREEN.category}
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textWrap: 'balance',
            }}
          >
            {LUTS_SCREEN.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14.5,
              lineHeight: 1.5,
              color: color.inkSoft,
              fontWeight: 500,
              textWrap: 'pretty',
            }}
          >
            {LUTS_SCREEN.lead}
          </p>
          <div
            style={{
              background: color.surface,
              borderRadius: radius.md,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: 13,
              lineHeight: 1.45,
              color: color.inkSoft,
              fontWeight: 500,
            }}
          >
            <span>{LUTS_SCREEN.hint}</span>
            <span style={{ color: color.faint }}>{LUTS_SCREEN.previewNote}</span>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {LUTS.map((lut) => (
            <Pressable
              key={lut.id}
              press="subtle"
              onClick={() => onOpen(lut)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                background: color.white,
                border: '1px solid rgba(12,11,13,0.08)',
                borderRadius: radius.lg,
                padding: 8,
                boxShadow: shadow.card,
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  display: 'block',
                  aspectRatio: '5 / 8',
                  borderRadius: radius.sm,
                  overflow: 'hidden',
                  background: color.surfaceAlt,
                }}
              >
                <img
                  src={lut.thumb}
                  alt={`Превью ${lut.title}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </span>

              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  padding: '0 2px 4px',
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3, color: color.ink }}>
                  {lut.title}
                </span>
                <span style={{ fontSize: 11.5, lineHeight: 1.3, color: color.inkSoft }}>
                  {lut.note}
                </span>
                <span style={{ fontFamily: font.mono, fontSize: 10.5, color: color.faint }}>
                  {lut.size}
                </span>
              </span>
            </Pressable>
          ))}
        </div>
      </div>
    </div>
  );
}
