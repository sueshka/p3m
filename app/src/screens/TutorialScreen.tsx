import { TUTORIAL, type TutorialBlock } from '../config/tutorial';
import { color, font, radius } from '../styles/tokens';
import { ScreenHeader } from '../components/ScreenHeader';

interface TutorialScreenProps {
  onClose: () => void;
}

const bodyStyle = {
  margin: 0,
  fontSize: 14.5,
  lineHeight: 1.5,
  color: color.inkSoft,
  fontWeight: 500,
  textWrap: 'pretty',
} as const;

function Block({ block }: { block: TutorialBlock }) {
  switch (block.kind) {
    case 'image':
      return (
        <img
          src={block.src}
          alt={block.alt ?? ''}
          loading="lazy"
          style={{
            width: '100%',
            display: 'block',
            borderRadius: radius.md,
            border: '1px solid rgba(12,11,13,0.08)',
          }}
        />
      );

    case 'bullets':
      return (
        <ul
          style={{
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {block.items?.map((item) => (
            <li key={item} style={{ display: 'flex', gap: 10, ...bodyStyle }}>
              <span
                aria-hidden
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: color.burgundy,
                  flex: '0 0 auto',
                  marginTop: 9,
                }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'numbers':
      return (
        <ol
          style={{
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {block.items?.map((item, i) => (
            <li key={item} style={{ display: 'flex', gap: 10, ...bodyStyle }}>
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: 12,
                  color: color.burgundy,
                  flex: '0 0 auto',
                  marginTop: 2,
                }}
              >
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case 'note':
      return (
        <div
          style={{
            background: color.surface,
            borderRadius: radius.md,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {block.heading && (
            <span style={{ fontSize: 14.5, fontWeight: 700, color: color.ink }}>
              {block.heading}
            </span>
          )}
          {block.body && <p style={{ ...bodyStyle, fontSize: 13.5 }}>{block.body}</p>}
        </div>
      );

    default:
      return <p style={bodyStyle}>{block.body}</p>;
  }
}

/** Full-screen article opened from the Open Gate material card. */
export function TutorialScreen({ onClose }: TutorialScreenProps) {
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
      <ScreenHeader title={TUTORIAL.title} onBack={onClose} />

      <div
        className="pc-scroll"
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: `18px 16px calc(32px + var(--pc-safe-bottom))`,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span
            style={{
              fontFamily: font.mono,
              fontSize: 9.5,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: color.burgundy,
            }}
          >
            {TUTORIAL.category}
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
            {TUTORIAL.title}
          </h1>
          <p style={bodyStyle}>{TUTORIAL.lead}</p>
          <img
            src={TUTORIAL.cover}
            alt={TUTORIAL.coverAlt}
            style={{
              width: '100%',
              display: 'block',
              borderRadius: radius.lg,
              marginTop: 2,
            }}
          />
        </section>

        {TUTORIAL.steps.map((step) => (
          <section key={step.index} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: 13,
                  fontWeight: 500,
                  color: color.burgundy,
                  flex: '0 0 auto',
                }}
              >
                {step.index}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  textWrap: 'balance',
                }}
              >
                {step.title}
              </h2>
            </div>
            {step.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        ))}

        <section
          style={{
            background: color.surface,
            borderRadius: radius.lg,
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {TUTORIAL.summary.title}
          </h2>
          <p style={{ ...bodyStyle, fontSize: 13.5 }}>{TUTORIAL.summary.body}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {TUTORIAL.summary.rows.map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(12,11,13,0.06)',
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 600, color: color.ink }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: font.mono,
                    fontSize: 12,
                    color: color.burgundy,
                    textAlign: 'right',
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <p style={{ ...bodyStyle, fontSize: 13.5 }}>{TUTORIAL.summary.outro}</p>
        </section>
      </div>
    </div>
  );
}
