import { APP } from '../config/content';
import { glass } from '../styles/tokens';

/**
 * Glass header holding just the app title.
 *
 * Telegram draws its own Close button and overflow menu in the native
 * chrome above the WebView, so the app does not repeat them here.
 */
export function Header() {
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
