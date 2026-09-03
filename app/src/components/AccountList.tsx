import { color, radius } from '../styles/tokens';
import { Pressable } from './Pressable';

export interface AccountItem {
  readonly id: string;
  readonly label: string;
}

interface AccountListProps {
  label: string;
  items: readonly AccountItem[];
  onSelect: (item: AccountItem) => void;
}

/** A labelled group of account rows on a soft grey card. */
export function AccountList({ label, items, onSelect }: AccountListProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: color.faint,
          paddingLeft: 4,
        }}
      >
        {label}
      </h2>
      <div style={{ background: color.surface, borderRadius: radius.xl, overflow: 'hidden' }}>
        {items.map((item, i) => (
          <Pressable
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: 16,
              borderBottom:
                i < items.length - 1 ? '1px solid rgba(12,11,13,0.05)' : undefined,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {item.label}
            <span aria-hidden style={{ color: color.ghost, fontWeight: 500 }}>
              ›
            </span>
          </Pressable>
        ))}
      </div>
    </section>
  );
}
