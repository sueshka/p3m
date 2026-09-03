import { useState } from 'react';
import { CONSENT_PURPOSE_ROWS, CONSENT_SCREEN, PRIVACY_POLICY, type PurposeRow } from '../config/legal';
import type { ConsentPurpose } from '../lib/consent';
import { REQUIRED_PURPOSES } from '../lib/consent';
import { color, font, radius } from '../styles/tokens';
import { haptic } from '../lib/telegram';
import { Logo } from '../components/Logo';
import { Pressable } from '../components/Pressable';
import { PrimaryCTA } from '../components/PrimaryCTA';

interface ConsentScreenProps {
  onAccept: (granted: Record<ConsentPurpose, boolean>) => void;
  onOpenDoc: (id: 'privacy' | 'consent') => void;
}

const initial = (): Record<ConsentPurpose, boolean> => ({
  p1: false,
  p2: false,
  p3: false,
  p4: false,
  p5: false,
});

function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: 26,
        height: 26,
        flex: '0 0 auto',
        borderRadius: 999,
        border: on ? `1.5px solid ${color.ink}` : '1.5px solid rgba(12,11,13,0.16)',
        background: on ? color.ink : 'transparent',
        color: color.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 700,
        transition: 'background .16s ease, border-color .16s ease',
      }}
    >
      {on ? '✓' : ''}
    </span>
  );
}

/** One consent item: tap the row to agree, tap ⓘ for the legal detail. */
function ConsentItem({
  row,
  on,
  onToggle,
  onOpenPolicy,
}: {
  row: PurposeRow;
  on: boolean;
  onToggle: () => void;
  onOpenPolicy: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: color.surface,
        borderRadius: radius.lg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          padding: '14px 14px 0',
        }}
      >
        {/* `display: contents` would drop the button box in some engines,
            so the toggle stays a normal flex row. */}
        <Pressable
          onClick={onToggle}
          aria-pressed={on}
          aria-label={row.label}
          style={{
            flex: '1 1 auto',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            textAlign: 'left',
          }}
        >
          <Check on={on} />
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.3,
              paddingTop: 3,
            }}
          >
            {row.label}
          </span>
        </Pressable>

        <Pressable
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={CONSENT_SCREEN.details}
          style={{
            width: 22,
            height: 22,
            marginTop: 3,
            borderRadius: 999,
            background: open ? color.ink : 'rgba(12,11,13,0.08)',
            color: open ? color.white : color.muted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            fontStyle: 'italic',
            fontFamily: 'Georgia, serif',
          }}
        >
          i
        </Pressable>
      </div>

      <div style={{ padding: '6px 14px 14px 52px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 12.5, lineHeight: 1.45, color: color.inkSoft }}>
          {row.short}
        </span>

        {open && (
          <dl
            style={{
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 10,
              rowGap: 7,
              fontSize: 11.5,
              lineHeight: 1.45,
              paddingTop: 2,
            }}
          >
            {[
              [CONSENT_SCREEN.dataLabel, row.data],
              [CONSENT_SCREEN.purposeLabel, row.purpose],
              [CONSENT_SCREEN.termLabel, row.term],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'contents' }}>
                <dt
                  style={{
                    fontFamily: font.mono,
                    fontSize: 9.5,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: color.hairline,
                    paddingTop: 2,
                  }}
                >
                  {label}
                </dt>
                <dd style={{ margin: 0, color: color.inkSoft }}>{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <Pressable
          onClick={onOpenPolicy}
          style={{
            alignSelf: 'flex-start',
            fontSize: 12.5,
            fontWeight: 600,
            color: color.ink,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          {CONSENT_SCREEN.policyLink}
        </Pressable>
      </div>
    </div>
  );
}

export function ConsentScreen({ onAccept, onOpenDoc }: ConsentScreenProps) {
  const [granted, setGranted] = useState(initial);

  const toggle = (id: ConsentPurpose) => {
    haptic('light');
    setGranted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const canProceed = REQUIRED_PURPOSES.every((p) => granted[p]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        background: color.page,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `calc(16px + var(--pc-safe-top)) 14px calc(16px + var(--pc-safe-bottom))`,
      }}
    >
      <div
        className="pc-scroll"
        style={{
          background: color.white,
          borderRadius: radius['3xl'],
          padding: '22px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxHeight: '100%',
          overflowY: 'auto',
          boxShadow: '0 24px 60px -28px rgba(12,11,13,0.4)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Logo size={52} inset={9} variant="solid" />
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textAlign: 'center',
            }}
          >
            {CONSENT_SCREEN.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.45,
              color: color.inkSoft,
              fontWeight: 500,
              textAlign: 'center',
              textWrap: 'pretty',
            }}
          >
            {CONSENT_SCREEN.lead}
          </p>
        </div>

        {CONSENT_PURPOSE_ROWS.map((row) => (
          <ConsentItem
            key={row.id}
            row={row}
            on={granted[row.id]}
            onToggle={() => toggle(row.id)}
            onOpenPolicy={() => onOpenDoc(PRIVACY_POLICY.id)}
          />
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PrimaryCTA
            label={CONSENT_SCREEN.accept}
            onClick={() => canProceed && onAccept(granted)}
            variant="burgundy"
            height={52}
            style={{
              opacity: canProceed ? 1 : 0.35,
              pointerEvents: canProceed ? 'auto' : 'none',
              boxShadow: canProceed ? undefined : 'none',
            }}
          />
          {!canProceed && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: color.faint,
                textAlign: 'center',
              }}
            >
              {CONSENT_SCREEN.hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
