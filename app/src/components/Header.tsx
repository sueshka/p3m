import { APP } from '../config/content';
import { glass } from '../styles/tokens';
import { isTelegram } from '../lib/telegram';

/**
 * Glass header holding just the app title.
 *
 * Inside Telegram it renders nothing: the client's own chrome already
 * shows the bot name above the WebView, so this would be a second title
 * stacked on the first. Outside Telegram — desktop windows and plain
 * browsers, where that chrome is absent — it is the app's only header.
 */
export function Header() {
  if (isTelegram()) return null;

  return (
    <header
      style={{
        flex: '0 0 auto',
        padding: '14px 16px 13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: glass.header,
        backdropFilter: glass.blurLg,
        WebkitBackdropFilter: glass.blurLg,
        borderBottom: '1px solid rgba(12,11,13,0.06)',
        position: 'relative',
        zIndex: 30,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 700 }}>{APP.title}</div>
    </header>
  );
}
