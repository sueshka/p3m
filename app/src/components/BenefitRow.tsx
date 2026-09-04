import type { Benefit } from '../config/content';
import { color, radius } from '../styles/tokens';

/**
 * One tile in the "Что внутри" grid — two per row, like a delivery-app
 * storefront. Equal heights come from the grid stretching each cell, so
 * a longer body never leaves its neighbour short.
 */
export function BenefitRow({ title, body, image }: Benefit) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: color.surface,
        borderRadius: radius.lg,
        padding: 10,
      }}
    >
      <span
        style={{
          display: 'block',
          aspectRatio: '1 / 1',
          borderRadius: radius.sm,
          overflow: 'hidden',
          background: color.surfaceAlt,
        }}
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </span>

      <span style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 4px 4px' }}>
        <span style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.25, textWrap: 'pretty' }}>
          {title}
        </span>
        <span
          style={{
            fontSize: 12,
            lineHeight: 1.4,
            color: color.inkSoft,
            fontWeight: 500,
            textWrap: 'pretty',
          }}
        >
          {body}
        </span>
      </span>
    </div>
  );
}
