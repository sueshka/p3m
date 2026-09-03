import { SHEETS } from '../config/content';
import { color, radius } from '../styles/tokens';
import { PrimaryCTA } from './PrimaryCTA';

const wrap = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  paddingBottom: 4,
  // Fills the sheet so the CTA settles at the bottom, within thumb reach.
  flex: '1 1 auto',
} as const;

/** Pushes whatever follows it to the bottom of the sheet. */
const spacer = { flex: '1 1 auto', minHeight: 8 } as const;

const bodyText = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.45,
  color: color.inkSoft,
} as const;

/** Grey panel used by the empty and in-progress states. */
function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        background: color.surface,
        borderRadius: radius.lg,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
      <span style={{ ...bodyText, fontSize: 13.5 }}>{body}</span>
    </div>
  );
}

/** "30 сентября 2026", or null when the date is missing or unparseable. */
function formatExpiry(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  // ru-RU appends "г." to a numeric year, which reads oddly in a UI label.
  return date
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    .replace(/\s*г\.$/, '');
}

/** "Мои покупки" — empty until a membership exists. */
export function PurchasesSheet({
  isMember,
  expiresAt = null,
  onJoin,
}: {
  isMember: boolean;
  /** ISO date access ends; omitted when unknown. */
  expiresAt?: string | null;
  onJoin: () => void;
}) {
  const S = SHEETS.purchases;
  if (!isMember) {
    return (
      <div style={wrap}>
        <Panel title={S.emptyTitle} body={S.emptyBody} />
        <div style={spacer} />
        <PrimaryCTA label={S.cta} onClick={onJoin} variant="burgundy" height={50} />
      </div>
    );
  }
  return (
    <div style={wrap}>
      <div
        style={{
          background: color.surface,
          borderRadius: radius.lg,
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <span
          style={{
            alignSelf: 'flex-start',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: color.white,
            background: color.burgundy,
            padding: '5px 10px',
            borderRadius: radius.pill,
          }}
        >
          {S.activeBadge}
        </span>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{S.activeTitle}</span>
        <span style={{ ...bodyText, fontSize: 13.5 }}>{S.activeBody}</span>
        {formatExpiry(expiresAt) && (
          <span
            style={{
              marginTop: 4,
              paddingTop: 10,
              borderTop: `1px solid ${color.surfaceAlt}`,
              fontSize: 13,
              fontWeight: 600,
              color: color.inkSoft,
            }}
          >
            {S.activeUntil} {formatExpiry(expiresAt)}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * "Доступ к комьюнити" — the community link only works for members;
 * everyone else is routed to the purchase flow instead.
 */
export function AccessSheet({
  isMember,
  onJoin,
  onOpenCommunity,
}: {
  isMember: boolean;
  onJoin: () => void;
  onOpenCommunity: () => void;
}) {
  const S = SHEETS.access;
  return (
    <div style={wrap}>
      <Panel
        title={isMember ? S.activeTitle : S.lockedTitle}
        body={isMember ? S.activeBody : S.lockedBody}
      />
      <div style={spacer} />
      <PrimaryCTA
        label={isMember ? S.activeCta : S.lockedCta}
        onClick={isMember ? onOpenCommunity : onJoin}
        variant="burgundy"
        height={50}
      />
    </div>
  );
}

/**
 * Shared "in development" state for Уведомления and Условия. It carries
 * no action, so the panel is centred rather than left hanging at the top
 * of an otherwise empty sheet.
 */
export function ComingSoonSheet({ which }: { which: 'notifications' | 'terms' }) {
  const S = SHEETS[which];
  return (
    <div style={{ ...wrap, justifyContent: 'center', paddingBottom: 24 }}>
      <Panel title={S.body} body={S.hint} />
    </div>
  );
}
