import { OVERLAYS, OVERLAYS_SCREEN, type Overlay } from '../config/overlays';
import { color, font, radius, shadow } from '../styles/tokens';
import { OverlayPreview } from '../components/OverlayPreview';
import { Pressable } from '../components/Pressable';
import { ScreenHeader } from '../components/ScreenHeader';

interface OverlaysScreenProps {
  onClose: () => void;
  onOpen: (overlay: Overlay) => void;
}

/** Full-screen gallery of the free overlay pack. */
export function OverlaysScreen({ onClose, onOpen }: OverlaysScreenProps) {
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
      <ScreenHeader title="Overlays" onBack={onClose} />

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
            {OVERLAYS_SCREEN.category}
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
            {OVERLAYS_SCREEN.title}
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
            {OVERLAYS_SCREEN.lead}
          </p>
          <div
            style={{
              background: color.surface,
              borderRadius: radius.md,
              padding: '12px 14px',
              fontSize: 13,
              lineHeight: 1.45,
              color: color.inkSoft,
              fontWeight: 500,
            }}
          >
            {OVERLAYS_SCREEN.hint}
          </div>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          {OVERLAYS.map((overlay) => (
            <Pressable
              key={overlay.id}
              press="subtle"
              onClick={() => onOpen(overlay)}
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
                  position: 'relative',
                  display: 'block',
                  aspectRatio: '9 / 16',
                  borderRadius: radius.sm,
                  overflow: 'hidden',
                  background: color.ink,
                }}
              >
                <OverlayPreview src={overlay.file} poster={overlay.thumb} />
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    right: 6,
                    bottom: 6,
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Download, not play: the clip already loops on its own,
                      and a tap saves the file. */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 19h16"
                      stroke={color.ink}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>

              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  padding: '0 2px 4px',
                  color: color.ink,
                }}
              >
                {overlay.title}
              </span>
            </Pressable>
          ))}
        </div>
      </div>
    </div>
  );
}
