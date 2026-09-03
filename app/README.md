# Pocket Creator — Telegram Mini App

Production implementation of the `Pocket Creator Mini App.dc.html` design
(Claude Design handoff) as a Vite + React + TypeScript static SPA.

## Commands

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the built output
```

## Structure

```
src/
  App.tsx                 shell: tab state, Telegram wiring, screen switch
  config/
    links.ts              every outbound URL (Tribute, materials, support)
    content.ts            all Russian copy + material/benefit data
  styles/
    tokens.ts             colors, gradients, glass, radii, shadows, motion
    global.css            document styles, keyframes, press/focus states
  lib/telegram.ts         defensive Telegram WebApp SDK wrapper
  components/             Header, Hero, MembershipCard, MaterialCard,
                          BeforeAfter, BottomNavigation, primitives…
  screens/                HomeScreen, AccountScreen
public/assets/            logo, grade comparison frames, material covers
```

## Configuration

URLs are centralized in `src/config/links.ts` and can be overridden per
environment without a code change:

```bash
VITE_TRIBUTE_URL=https://t.me/tribute/app
VITE_OVERLAYS_URL=...
VITE_LUTS_URL=...
VITE_OPEN_GATE_URL=...
VITE_SUPPORT_URL=...
VITE_COMMUNITY_URL=...
```

## Deploying

`npm run build` emits a fully static `dist/` with relative asset paths, so
it can be hosted from any static host or subpath. Point the Telegram Mini
App URL (via @BotFather) at the deployed `index.html` — it must be HTTPS.

## Membership state

`MOCK_IS_MEMBER` in `src/App.tsx` gates the Account screen between the
locked and active cards. Both states are fully built; replace that
constant with a real entitlement check (Tribute webhook + `initData`
validation on a backend) when the backend exists.

**Note:** `initDataUnsafe` is used only for display (name/handle). Never
trust it for access control — validate the signed `initData` server-side
before granting membership.
