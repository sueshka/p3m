import { LEGAL_DOCS, LEGAL_SCREEN, type LegalDoc } from '../config/legal';
import { color, radius } from '../styles/tokens';
import { Pressable } from '../components/Pressable';

interface LegalScreenProps {
  /** When set, the screen shows this document instead of the list. */
  doc: LegalDoc | null;
  onSelectDoc: (doc: LegalDoc) => void;
  onBack: () => void;
  onClose: () => void;
}

/** Renders the document body: `##` lines become headings, `-` become bullets. */
function DocBody({ text }: { text: string }) {
  const blocks = text.split('\n').filter((l) => l.trim().length > 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {blocks.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) {
          const level = trimmed.match(/^#+/)?.[0].length ?? 1;
          return (
            <h2
              key={i}
              style={{
                margin: '8px 0 0',
                fontSize: level <= 2 ? 17 : 15,
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              {trimmed.replace(/^#+\s*/, '')}
            </h2>
          );
        }
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          return (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <span
                aria-hidden
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: color.burgundy,
                  flex: '0 0 auto',
                  marginTop: 8,
                }}
              />
              <span style={{ fontSize: 14, lineHeight: 1.5, color: color.inkSoft }}>
                {trimmed.replace(/^[-*]\s*/, '')}
              </span>
            </div>
          );
        }
        return (
          <p
            key={i}
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.5,
              color: color.inkSoft,
              textWrap: 'pretty',
            }}
          >
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export function LegalScreen({ doc, onSelectDoc, onBack, onClose }: LegalScreenProps) {
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
          onClick={doc ? onBack : onClose}
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
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
          }}
        >
          {doc ? doc.title : LEGAL_SCREEN.title}
        </span>
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
          gap: 16,
        }}
      >
        {doc ? (
          <DocBody text={doc.body} />
        ) : (
          <>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.5,
                color: color.inkSoft,
                fontWeight: 500,
              }}
            >
              {LEGAL_SCREEN.lead}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LEGAL_DOCS.map((item) => (
                <Pressable
                  key={item.id}
                  press="subtle"
                  onClick={() => onSelectDoc(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    width: '100%',
                    background: color.surface,
                    borderRadius: radius.lg,
                    padding: 16,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: 12.5, color: color.inkSoft, lineHeight: 1.35 }}>
                      {item.subtitle}
                    </span>
                  </span>
                  <span aria-hidden style={{ color: color.ghost, fontWeight: 500 }}>
                    ›
                  </span>
                </Pressable>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
