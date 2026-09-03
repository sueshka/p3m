import { color, radius } from '../styles/tokens';

interface SectionHeadingProps {
  title: string;
  /** Small right-aligned label, e.g. "5 блоков". */
  meta?: string;
  /**
   * Renders the meta as a green pill instead of muted text, for a label
   * worth noticing — "бесплатно" is the reason to look at the section.
   */
  highlightMeta?: boolean;
}

/** The title + muted meta row that opens each Home section. */
export function SectionHeading({ title, meta, highlightMeta = false }: SectionHeadingProps) {
  return (
    <div
      style={{
        display: 'flex',
        // A pill needs its box centred on the title; plain text sits on the
        // baseline with it.
        alignItems: highlightMeta ? 'center' : 'baseline',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: '-0.03em',
        }}
      >
        {title}
      </h2>
      {meta && !highlightMeta && (
        <span style={{ fontSize: 12, fontWeight: 600, color: color.muted }}>{meta}</span>
      )}
      {meta && highlightMeta && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: color.freeInk,
            background: color.freeSurface,
            border: `1px solid ${color.freeEdge}`,
            padding: '5px 11px 5px 8px',
            borderRadius: radius.pill,
            whiteSpace: 'nowrap',
          }}
        >
          {/* Reads as a switch left on: the material is already unlocked. */}
          <span
            aria-hidden
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: color.free,
              boxShadow: `0 0 0 3px ${color.freeGlow}`,
            }}
          />
          {meta}
        </span>
      )}
    </div>
  );
}
