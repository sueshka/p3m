import type { Benefit } from '../config/content';
import { color, radius } from '../styles/tokens';

/**
 * One tile in the "Что внутри" grid — two per row, like a delivery-app
 * storefront. Equal heights come from the grid stretching each cell, so
 * a longer body never leaves its neighbour short.
 */
export function BenefitRow({ title, body }: Benefit) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        background: color.surface,
        borderRadius: radius.lg,
        padding: 16,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, textWrap: 'pretty' }}>
        {title}
      </span>
      <span
        style={{
          fontSize: 12.5,
          lineHeight: 1.4,
          color: color.inkSoft,
          fontWeight: 500,
          textWrap: 'pretty',
        }}
      >
        {body}
      </span>
    </div>
  );
}
