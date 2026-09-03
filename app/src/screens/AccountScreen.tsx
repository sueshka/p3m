import { ACCOUNT, APP } from '../config/content';
import { color, font, glass, gradient, motion, radius } from '../styles/tokens';
import { haptic } from '../lib/telegram';
import { AccountList, type AccountItem } from '../components/AccountList';
import { GlassBadge } from '../components/GlassBadge';
import { Avatar } from '../components/Avatar';
import { PrimaryCTA } from '../components/PrimaryCTA';

interface AccountScreenProps {
  userName: string;
  userHandle: string;
  photoUrl?: string;
  /** Mocked for v1 — swap for a real entitlement check later. */
  isMember: boolean;
  onJoin: () => void;
  onOpenCommunity: () => void;
  onSelectRow: (id: string) => void;
}

/** Locked state: membership not yet purchased. */
function LockedCard({ onJoin }: { onJoin: () => void }) {
  return (
    <section
      style={{
        flex: '0 0 auto',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius['3xl'],
        background: gradient.accessLocked,
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          right: -80,
          top: -110,
          borderRadius: 999,
          background: gradient.glowMuted,
        }}
      />
      <GlassBadge style={{ position: 'relative', alignSelf: 'flex-start' }}>
        {ACCOUNT.locked.badge}
      </GlassBadge>
      <h2
        style={{
          position: 'relative',
          margin: 0,
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#FFFFFF',
          lineHeight: 1.25,
        }}
      >
        {ACCOUNT.locked.title}
      </h2>
      <p
        style={{
          position: 'relative',
          margin: 0,
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 500,
          lineHeight: 1.45,
        }}
      >
        {ACCOUNT.locked.body}
      </p>
      <PrimaryCTA
        label={ACCOUNT.locked.cta}
        onClick={onJoin}
        variant="light"
        height={50}
        fontSize={15.5}
        style={{ position: 'relative', boxShadow: 'none' }}
      />
    </section>
  );
}

/** Active state: membership live, perks unlocked. */
function ActiveCard({ onOpenCommunity }: { onOpenCommunity: () => void }) {
  return (
    <section
      style={{
        flex: '0 0 auto',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: radius['3xl'],
        background: gradient.accessActive,
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          left: -70,
          bottom: -120,
          borderRadius: 999,
          background: gradient.glowWineSoft,
        }}
      />
      <GlassBadge emphasis style={{ position: 'relative', alignSelf: 'flex-start' }}>
        {ACCOUNT.active.badge}
      </GlassBadge>
      <h2
        style={{
          position: 'relative',
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#FFFFFF',
        }}
      >
        {ACCOUNT.active.title}
      </h2>
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}
      >
        {ACCOUNT.active.perks.map((perk) => (
          <div
            key={perk}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: glass.blurMd,
              WebkitBackdropFilter: glass.blurMd,
              borderRadius: radius.md,
              padding: 12,
              fontSize: 13,
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            {perk}
          </div>
        ))}
      </div>
      <PrimaryCTA
        label={ACCOUNT.active.cta}
        onClick={onOpenCommunity}
        variant="glass"
        height={50}
        fontSize={15.5}
        style={{ position: 'relative' }}
      />
    </section>
  );
}

export function AccountScreen({
  userName,
  userHandle,
  photoUrl,
  isMember,
  onJoin,
  onOpenCommunity,
  onSelectRow,
}: AccountScreenProps) {
  const openRow = (item: AccountItem) => {
    haptic('light');
    onSelectRow(item.id);
  };
  return (
    <div
      className="pc-scroll"
      style={{
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '22px 16px 132px',
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
        animation: motion.rise,
      }}
    >
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
          {ACCOUNT.title}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: color.surface,
            borderRadius: radius.xl,
            padding: 14,
          }}
        >
          <Avatar
            photoUrl={photoUrl}
            name={userName}
            size={52}
            inset={8}
            style={{ boxShadow: 'none' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{userName}</span>
            <span style={{ fontFamily: font.mono, fontSize: 11.5, color: color.muted }}>
              {userHandle}
            </span>
          </div>
        </div>
      </section>

      {isMember ? <ActiveCard onOpenCommunity={onOpenCommunity} /> : <LockedCard onJoin={onJoin} />}

      {ACCOUNT.groups.map((group) => (
        <AccountList
          key={group.label}
          label={group.label}
          items={group.items}
          onSelect={openRow}
        />
      ))}

      <p
        style={{
          margin: 0,
          textAlign: 'center',
          fontFamily: font.mono,
          fontSize: 10.5,
          color: color.hairline,
        }}
      >
        {APP.version}
      </p>

    </div>
  );
}
