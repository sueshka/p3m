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
import { ConsentScreen } from './screens/ConsentScreen';
import { LegalScreen } from './screens/LegalScreen';
import { LEGAL_DOCS, type LegalDoc } from './config/legal';
import { fetchMembership } from './lib/membership';
import {
  hasRequiredConsent,
  loadConsent,
  saveConsent,
  type ConsentPurpose,
} from './lib/consent';
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

/**
 * Membership comes from the server (see api/membership.ts). Until it
 * answers, and whenever it cannot be reached, the user is treated as a
 * guest — access is never granted on a failure.
 */

/** Which account row opened the sheet; null means no sheet is open. */
type SheetId = 'purchases' | 'access' | 'notifications' | 'support' | 'terms';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [sheet, setSheet] = useState<SheetId | null>(null);
  const [tutorial, setTutorial] = useState(false);
  const [overlays, setOverlays] = useState(false);
  const [luts, setLuts] = useState(false);
  // Consent gate: null while unknown, so the app never flashes before
  // the stored record has been read.
  const [consented, setConsented] = useState<boolean | null>(null);
  const [isMember, setIsMember] = useState(false);
  /**
   * True when the server could not verify with Tribute. Access stays denied,
   * but the UI says "could not check" instead of accusing a paying member of
   * not having joined.
   */
  const [checkFailed, setCheckFailed] = useState(false);
  /** ISO date access ends, shown on the purchases sheet. */
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const [user, setUser] = useState(() => getTelegramUser());

  useEffect(() => {
    initTelegram();
    const tgUser = getTelegramUser();
    setUser(tgUser);
    setConsented(hasRequiredConsent(loadConsent(tgUser?.id)));

    let cancelled = false;
    fetchMembership().then((state) => {
      if (cancelled) return;
      setIsMember(state.status === 'member');
      setExpiresAt(state.status === 'member' ? state.expiresAt : null);
      setCheckFailed(state.status === 'unknown');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Re-run the entitlement check after a failed verification. */
  const retryMembership = async () => {
    haptic('medium');
    setCheckFailed(false);
    const state = await fetchMembership();
    setIsMember(state.status === 'member');
    setExpiresAt(state.status === 'member' ? state.expiresAt : null);
    setCheckFailed(state.status === 'unknown');
  };

  const acceptConsent = (granted: Record<ConsentPurpose, boolean>) => {
    saveConsent(granted, user?.id);
    haptic('medium');
    setConsented(true);
  };

  const openLegal = (docId?: 'privacy' | 'consent') => {
    setLegalDoc(docId ? (LEGAL_DOCS.find((d) => d.id === docId) ?? null) : null);
    setLegalOpen(true);
  };

  const closeLegal = () => {
    setLegalOpen(false);
    setLegalDoc(null);
  };

  const closeSheet = useCallback(() => setSheet(null), []);

  const goHome = useCallback(() => {
    haptic('light');
    setTab('home');
  }, []);

  // The native Back button closes an open sheet first, and only then
  // leaves the Account tab — matching what the gesture does elsewhere
  // in Telegram.
  const onBack = useCallback(() => {
    if (legalOpen && legalDoc) setLegalDoc(null);
    else if (legalOpen) closeLegal();
    else if (tutorial) setTutorial(false);
    else if (overlays) setOverlays(false);
    else if (luts) setLuts(false);
    else if (sheet !== null) closeSheet();
    else goHome();
  }, [legalOpen, legalDoc, tutorial, overlays, luts, sheet, closeSheet, goHome]);

  // The native Back button returns to Home from Account, matching what a
  // Telegram user expects from the hardware/system gesture.
  useEffect(
    () =>
      bindBackButton(
        tab !== 'home' || sheet !== null || tutorial || overlays || luts || legalOpen,
        onBack,
      ),
    [tab, sheet, tutorial, overlays, luts, legalOpen, onBack],
  );

  const changeTab = (next: Tab) => {
    haptic('light');
    setSheet(null);
    setTab(next);
  };

  /**
   * Guests go to Tribute to buy. Members have nothing to buy, so send them
   * to their account, where the community button lives.
   */
  const join = () => {
    if (isMember) {
      changeTab('account');
      return;
    }
    openLink(LINKS.TRIBUTE_PURCHASE_URL);
  };
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

  // Nothing renders until the stored consent has been read, so the app
  // never appears for a split second before the gate.
  if (consented === null) {
    return <div style={{ height: 'var(--pc-viewport)', background: color.white }} />;
  }

  if (!consented) {
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
          letterSpacing: '-0.01em',
        }}
      >
        <ConsentScreen onAccept={acceptConsent} onOpenDoc={openLegal} />
        {/* Above the consent screen's own z-index, or it would render
            underneath and the tap would look like a no-op. */}
        {legalOpen && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 300 }}>
            <LegalScreen
              doc={legalDoc}
              onSelectDoc={setLegalDoc}
              onBack={closeLegal}
              onClose={closeLegal}
            />
          </div>
        )}
      </div>
    );
  }

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
          isMember={isMember}
          onJoin={join}
          onOpenMaterial={openMaterial}
        />
      ) : (
        <AccountScreen
          userName={userName}
          userHandle={userHandle}
          photoUrl={user?.photo_url}
          isMember={isMember}
          checkFailed={checkFailed}
          onJoin={join}
          onRetryCheck={retryMembership}
          onOpenCommunity={openCommunity}
          onSelectRow={(id) => {
            if (id === 'terms') {
              openLegal();
              return;
            }
            setSheet(id as SheetId);
          }}
        />
      )}

      <BottomNavigation active={tab} onChange={changeTab} />

      {tutorial && <TutorialScreen onClose={() => setTutorial(false)} />}

      {overlays && (
        <OverlaysScreen onClose={() => setOverlays(false)} onOpen={openOverlayFile} />
      )}

      {luts && <LutsScreen onClose={() => setLuts(false)} onOpen={openLutFile} />}

      {legalOpen && (
        <LegalScreen
          doc={legalDoc}
          onSelectDoc={setLegalDoc}
          onBack={() => setLegalDoc(null)}
          onClose={closeLegal}
        />
      )}

      <BottomSheet
        open={sheet !== null}
        title={sheet ? SHEETS[sheet].title : ''}
        onClose={closeSheet}
      >
        {sheet === 'purchases' && (
          <PurchasesSheet isMember={isMember} expiresAt={expiresAt} onJoin={join} />
        )}
        {sheet === 'access' && (
          <AccessSheet
            isMember={isMember}
            onJoin={join}
            onOpenCommunity={openCommunity}
          />
        )}
        {sheet === 'notifications' && <ComingSoonSheet which="notifications" />}
        {sheet === 'support' && <SupportForm onDone={closeSheet} />}
      </BottomSheet>
    </div>
  );
}
