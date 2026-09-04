import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './styles/global.css';

/**
 * Keeps --pc-viewport pinned to Telegram's stable viewport height, which
 * excludes the collapsing header and the keyboard. Falls back to the
 * visual viewport, then to 100dvh via the CSS default.
 */
function syncViewport() {
  const app = window.Telegram?.WebApp;
  const height = app?.viewportStableHeight ?? window.innerHeight;
  if (height) {
    document.documentElement.style.setProperty('--pc-viewport', `${height}px`);
  }
}

syncViewport();
window.addEventListener('resize', syncViewport);
window.Telegram?.WebApp?.onEvent?.('viewportChanged', syncViewport);

const container = document.getElementById('root');
if (!container) throw new Error('Root container #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
);
