import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { color, radius } from '../styles/tokens';
import { Pressable } from './Pressable';

interface BottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Modal sheet that slides up over the current screen.
 *
 * Closing is offered three ways — the scrim, the header button and the
 * Escape key — so the sheet never traps the user on a device where one
 * of them is awkward.
 */
export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        // Above the floating nav pill (z-index 20).
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        // The app is centred with a max width; keep the sheet aligned to
        // it rather than to the full window on wide screens.
        maxWidth: 430,
        margin: '0 auto',
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(12,11,13,0.4)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          animation: 'pcFade .2s ease both',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'relative',
          background: color.white,
          borderRadius: `${radius['4xl']} ${radius['4xl']} 0 0`,
          padding: `10px 20px calc(28px + var(--pc-safe-bottom))`,
          // Sheets sit roughly half-screen even when their content is
          // short, so they read as a panel rather than a strip pinned to
          // the bottom edge. Taller content grows up to the max.
          minHeight: '44dvh',
          maxHeight: '86dvh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'pcSheetUp .28s cubic-bezier(0.32, 0.72, 0, 1) both',
          boxShadow: '0 -20px 50px -20px rgba(12,11,13,0.4)',
        }}
      >
        <div
          aria-hidden
          style={{
            width: 38,
            height: 4,
            borderRadius: 999,
            background: 'rgba(12,11,13,0.15)',
            margin: '0 auto 14px',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 14,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>
            {title}
          </h2>
          <Pressable
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              flex: '0 0 auto',
              background: color.surface,
              color: color.inkSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            ✕
          </Pressable>
        </div>

        <div
          className="pc-scroll"
          style={{
            overflowY: 'auto',
            flex: '1 1 auto',
            // Room for the CTA's drop shadow, which the scroll container
            // would otherwise clip.
            padding: '2px 2px 6px',
            margin: '0 -2px',
            // Lets a section push its CTA to the bottom of a sheet that
            // is taller than its content.
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
