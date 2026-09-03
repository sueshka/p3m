import { color } from '../styles/tokens';
import { isTelegram } from '../lib/telegram';
import { Pressable } from './Pressable';

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  /** Title size differs slightly per screen; 16 suits most of them. */
  fontSize?: number;
}

/**
 * Back row for a full-screen subview.
 *
 * Inside Telegram this renders nothing: the client already draws its own
 * chrome above the WebView — bot name plus a Back button — so an in-page
 * copy stacks a second title and a second back affordance on top of it.
 * The native Back button is wired in App.tsx, and each screen still
 * carries its own headline in the content, so nothing is lost.
 */
export function ScreenHeader({ title, onBack, fontSize = 16 }: ScreenHeaderProps) {
  if (isTelegram()) return null;

  return (
    <header
      style={{
        flex: '0 0 auto',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid rgba(12,11,13,0.06)',
        background: color.white,
        zIndex: 2,
      }}
    >
      <Pressable
        onClick={onBack}
        aria-label="Назад"
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          flex: '0 0 auto',
          background: color.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          color: color.ink,
        }}
      >
        ‹
      </Pressable>
      <span
        style={{
          fontSize,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
        }}
      >
        {title}
      </span>
    </header>
  );
}
