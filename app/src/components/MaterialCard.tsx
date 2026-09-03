import type { Material } from '../config/content';
import { color, font, radius, shadow } from '../styles/tokens';
import { Pressable } from './Pressable';

interface MaterialCardProps {
  material: Material;
  onOpen: (material: Material) => void;
}

/** Free-resource card: cover, category, title, description and CTA. */
export function MaterialCard({ material, onOpen }: MaterialCardProps) {
  return (
    <Pressable
      press="subtle"
      onClick={() => onOpen(material)}
      style={{
        display: 'grid',
        gridTemplateColumns: '96px 1fr',
        gap: 14,
        alignItems: 'center',
        width: '100%',
        background: color.white,
        border: '1px solid rgba(12,11,13,0.08)',
        borderRadius: radius.xl,
        padding: 12,
        boxShadow: shadow.card,
      }}
    >
      <span style={{ height: 96, borderRadius: radius.md, overflow: 'hidden', display: 'block' }}>
        <img
          src={material.cover}
          alt={material.alt}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </span>

      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingRight: 4,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: font.mono,
            fontSize: 9.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: color.burgundy,
          }}
        >
          {material.category}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25 }}>{material.title}</span>
        <span
          style={{
            fontSize: 12.5,
            color: color.inkSoft,
            fontWeight: 500,
            lineHeight: 1.35,
          }}
        >
          {material.body}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: color.ink }}>{material.cta}</span>
      </span>
    </Pressable>
  );
}
