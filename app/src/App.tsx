import { useCallback, useEffect, useState } from 'react';
import { HOME, SHEETS } from './config/content';
import { LINKS } from './config/links';
import type { Material } from './config/content';
import { BottomNavigation, type Tab } from './components/BottomNavigation';
import { BottomSheet } from './components/BottomSheet';
import { SupportForm } from './components/SupportForm';
import { AccessSheet, ComingSoonSheet, PurchasesSheet } from './components/SheetStates';
import { TutorialScreen } from './screens/TutorialScreen';
import { OverlaysScreen } from './screens/OverlaysScreen';
import { LutsScreen } from './screens/LutsScreen';
import type { Overlay } from './config/overlays';
import type { Lut } from './config/luts';
import { Header } from './components/Header';
import { AccountScreen } from './screens/AccountScreen';
import { HomeScreen } from './screens/HomeScreen';
import {
  bindBackButton,
  getTelegramUser,
  haptic,
  initTelegram,
  openLink,
} from './lib/telegram';
import { ACCOUNT } from './config/content';
import { color } from './styles/tokens';

/** Membership is mocked for v1; wire to a real entitlement check later. */
const MOCK_IS_MEMBER = false;

/** Which account row opened the sheet; null means no sheet is open. */
type SheetId = 'purchases' | 'access' | 'notifications' | 'support' | 'terms';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [sheet, setSheet] = useState<SheetId | null>(null);
  const [tutorial, setTutorial] = useState(false);
  const [overlays, setOverlays] = useState(false);
  const [luts, setLuts] = useState(false);
  const [user, setUser] = useState(() => getTelegramUser());

  useEffect(() => {
    initTelegram();
    setUser(getTelegramUser());
  }, []);

  const closeSheet = useCallback(() => setSheet(null), []);

  const goHome = useCallback(() => {
    haptic('light');
    setTab('home');
  }, []);

  // The native Back button closes an open sheet first, and only then
  // leaves the Account tab — matching what the gesture does elsewhere
  // in Telegram.
  const onBack = useCallback(() => {
    if (tutorial) setTutorial(false);
    else if (overlays) setOverlays(false);
    else if (luts) setLuts(false);
    else if (sheet !== null) closeSheet();
    else goHome();
  }, [tutorial, overlays, luts, sheet, closeSheet, goHome]);

  // The native Back button returns to Home from Account, matching what a
  // Telegram user expects from the hardware/system gesture.
  useEffect(
    () =>
      bindBackButton(tab !== 'home' || sheet !== null || tutorial || overlays || luts, onBack),
    [tab, sheet, tutorial, overlays, luts, onBack],
  );

  const changeTab = (next: Tab) => {
    haptic('light');
    setSheet(null);
    setTab(next);
  };

  const join = () => openLink(LINKS.TRIBUTE_PURCHASE_URL);
  const openMaterial = (material: Material) => {
    if (material.id === 'opengate') {
      haptic('light');
      setTutorial(true);
      return;
    }
    if (material.id === 'overlays') {
      haptic('light');
      setOverlays(true);
      return;
    }
    if (material.id === 'luts') {
      haptic('light');
      setLuts(true);
      return;
    }
    openLink(material.url);
  };

  /**
   * Telegram's WebView blocks in-page downloads, so an overlay is handed
   * to the external browser, where the viewer can save it normally.
   */
  const openOverlayFile = (overlay: Overlay) => {
    openLink(new URL(overlay.file, window.location.href).href);
  };

  const openLutFile = (lut: Lut) => {
    openLink(new URL(lut.file, window.location.href).href);
  };
  const openCommunity = () => openLink(LINKS.COMMUNITY_URL);
  // Account shows the full name; the Home greeting uses the first name
  // alone so the headline stays on one line.
  const userName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || ACCOUNT.fallbackName;
  const userHandle = user?.username ? `@${user.username}` : ACCOUNT.fallbackHandle;
  const greetingName = user?.first_name?.trim() || HOME.greetingFallback;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 430,
        height: 'var(--pc-viewport)',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        background: color.white,
        color: color.ink,
        display: 'flex',
        flexDirection: 'column',
        letterSpacing: '-0.01em',
      }}
    >
      <Header />

      {tab === 'home' ? (
        <HomeScreen
          greetingName={greetingName}
          photoUrl={user?.photo_url}
          onJoin={join}
          onOpenMaterial={openMaterial}
        />
      ) : (
        <AccountScreen
          userName={userName}
          userHandle={userHandle}
          photoUrl={user?.photo_url}
          isMember={MOCK_IS_MEMBER}
          onJoin={join}
          onOpenCommunity={openCommunity}
          onSelectRow={(id) => setSheet(id as SheetId)}
        />
      )}

      <BottomNavigation active={tab} onChange={changeTab} />

      {tutorial && <TutorialScreen onClose={() => setTutorial(false)} />}

      {overlays && (
        <OverlaysScreen onClose={() => setOverlays(false)} onOpen={openOverlayFile} />
      )}

      {luts && <LutsScreen onClose={() => setLuts(false)} onOpen={openLutFile} />}

      <BottomSheet
        open={sheet !== null}
        title={sheet ? SHEETS[sheet].title : ''}
        onClose={closeSheet}
      >
        {sheet === 'purchases' && <PurchasesSheet isMember={MOCK_IS_MEMBER} onJoin={join} />}
        {sheet === 'access' && (
          <AccessSheet
            isMember={MOCK_IS_MEMBER}
            onJoin={join}
            onOpenCommunity={openCommunity}
          />
        )}
        {sheet === 'notifications' && <ComingSoonSheet which="notifications" />}
        {sheet === 'terms' && <ComingSoonSheet which="terms" />}
        {sheet === 'support' && <SupportForm onDone={closeSheet} />}
      </BottomSheet>
    </div>
  );
}
