# Known issues

Findings from the code review of `14cb813` "Hide in-app headers inside Telegram,
extract ScreenHeader". None are fixed yet.

Severity scale: **High** — breaks a user flow with no workaround inside the app.
**Medium** — visible defect, flow still completes. **Low** — inconsistency with
no user-visible effect today.

---

## 1. Subview becomes inescapable when Telegram has no BackButton — High

**Where:** [`app/src/components/ScreenHeader.tsx:22`](../app/src/components/ScreenHeader.tsx#L22)

`ScreenHeader` hides itself on `isTelegram()`, which only checks that
`window.Telegram?.WebApp` exists ([`telegram.ts:57`](../app/src/lib/telegram.ts#L57)).
But the native fallback it relies on is capability-gated: `bindBackButton`
returns a no-op when `BackButton` is missing
([`telegram.ts:110-111`](../app/src/lib/telegram.ts#L110-L111)), and the codebase's
own type marks it optional (`BackButton?`).

On a client that injects `Telegram.WebApp` without `BackButton` (Bot API < 6.1)
the two guards disagree: the in-page header hides, the native button never
appears. Because Tutorial / LUTs / Overlays / Legal render `position: absolute;
inset: 0` over the whole app, the user is stuck on that screen — no back
affordance of any kind, and the only exit is killing the mini app.

**Why High:** total dead end in a user flow, and the affected clients get no
degraded-but-usable path — they get no path.

**Fix:** gate on the capability rather than on the host, so both conditions
agree:

```ts
if (tg()?.BackButton) return null;
```

---

## 2. Legal list screen has no title inside Telegram — Medium

**Where:** [`app/src/screens/LegalScreen.tsx:89`](../app/src/screens/LegalScreen.tsx#L89)

`ScreenHeader`'s doc comment claims "each screen still carries its own headline
in the content." True for Luts, Overlays and Tutorial (each has an in-content
`<h1>`) and for the Legal *document* branch (bodies open with a `#` heading).
Not true for the Legal *list* branch: the header was the only render of
`LEGAL_SCREEN.title` ("Условия и документы"), and the content starts straight at
the lead paragraph.

Inside Telegram that screen is now untitled — Telegram's chrome shows the bot
name, not the screen name.

**Why Medium:** the screen still works and its two rows are self-describing, so
the flow completes; it just reads as unlabelled.

**Fix:** render `LEGAL_SCREEN.title` as an in-content `<h1>` on the list branch,
matching how the other three screens carry their headline.

---

## 3. In-page back from a legal document behaves differently in the consent gate — Low

**Where:** [`app/src/App.tsx:211`](../app/src/App.tsx#L211) vs
[`app/src/App.tsx:278`](../app/src/App.tsx#L278)

In the consent-gate branch `LegalScreen` gets `onBack={closeLegal}`; the main
branch gets `onBack={() => setLegalDoc(null)}`. So in the gate, in-page back from
an open document closes the whole legal screen instead of returning to the list.

Predates `14cb813` (confirmed at `HEAD~1`). Commit `14cb813` makes it invisible
inside Telegram, since native Back always routes through `App.onBack`
([`App.tsx:106-114`](../app/src/App.tsx#L106-L114)), which does the right thing.

**Why Low:** no user-visible effect inside Telegram at all; reachable only in a
plain browser, where it still leaves the user somewhere sensible.

**Fix:** pass `onBack={() => setLegalDoc(null)}` in the gate branch too, so both
call sites behave alike.

---

## Not covered

`/security-review` did not run — it resolves its diff against `origin/HEAD`,
which is unset in this repo. Nothing in the list above came from a security pass.
