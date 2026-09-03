import { color } from '../styles/tokens';

interface SectionHeadingProps {
  title: string;
  /** Small right-aligned label, e.g. "5 блоков". */
  meta?: string;
}

/** The title + muted meta row that opens each Home section. */
export function SectionHeading({ title, meta }: SectionHeadingProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
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
      {meta && (
        <span style={{ fontSize: 12, fontWeight: 600, color: color.muted }}>{meta}</span>
      )}
    </div>
  );
}
