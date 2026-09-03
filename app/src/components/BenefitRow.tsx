import type { Benefit } from '../config/content';
import { color, font, radius } from '../styles/tokens';

/** One numbered row in the "Что внутри комьюнити" list. */
export function BenefitRow({ index, title, body }: Benefit) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr',
        gap: 14,
        alignItems: 'start',
        background: color.surface,
        borderRadius: radius.lg,
        padding: 16,
      }}
    >
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 13,
          fontWeight: 500,
          color: color.burgundy,
          paddingTop: 2,
        }}
      >
        {index}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
        <span
          style={{ fontSize: 13, lineHeight: 1.4, color: color.inkSoft, fontWeight: 500 }}
        >
          {body}
        </span>
      </div>
    </div>
  );
}
