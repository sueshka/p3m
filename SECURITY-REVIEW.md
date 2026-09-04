# Security Review — Vulnerability Tracker

Living record of security findings for the Pocket Creator Mini App.
Update the status column as items are fixed; keep closed items for history.

Last reviewed: 2026-09-04 (branch `main`)

## Status of the reviewed diff

The staged change on this branch is a **comment-only edit** to
[tokens.ts](app/src/styles/tokens.ts) — the JSDoc header was reworded to drop a
reference to the source prototype filename. No token values changed, and the
file contains only cosmetic styling constants.

**Findings introduced by this diff: none.**

The items below were found while reviewing the surrounding API surface for
context. They are **pre-existing**, not regressions from this change.

## Open findings

_None._

## Notes on things checked and found sound

Recorded so future reviews do not re-litigate them:

- **Telegram auth is server-side and fail-closed.** `verifyInitData` runs on the
  server, rejects missing/blank `initData`, rejects a missing bot token rather
  than passing, and enforces a 24h `auth_date` replay window
  ([telegram-auth.ts:62-66](app/api/_lib/telegram-auth.ts#L62-L66)). The client's
  `initDataUnsafe` is never trusted for access decisions.
- **`/api/membership` does not grant access on error.** Storage failures return
  503 with `isMember: false`; a Tribute outage is distinguished from a confirmed
  non-payment so an outage never silently unlocks content
  ([membership.ts:59-64](app/api/membership.ts#L59-L64)).
- **`/api/admin-grant` uses constant-time secret comparison** and refuses to
  authenticate when `ADMIN_SECRET` is unset — an empty env var fails closed
  rather than matching an empty header ([admin-grant.ts:44](app/api/admin-grant.ts#L44)).
- **`/api/tribute-webhook` verifies an HMAC-SHA256 signature before any state
  change**, with length check plus constant-time compare.
- **No injection surface in KV access.** `store.ts` builds Redis commands as
  argument arrays, not concatenated strings, so a hostile `telegramId` cannot
  break out into another command; ids are also coerced with `Number()` and
  finiteness-checked before reaching storage.
- **No secrets in the client bundle.** All tokens (`TELEGRAM_BOT_TOKEN`,
  `ADMIN_SECRET`, `TRIBUTE_API_KEY`, KV credentials) are read from
  `process.env` inside Edge handlers only.
- **XSS:** the frontend is React with no `dangerouslySetInnerHTML`.

## Closed findings

### 1. `initData` signature compared without constant-time equality — FIXED 2026-09-04

- **Severity:** Low · **Category:** `crypto`
- The computed HMAC was compared with `computed !== hash`, which short-circuits
  on the first differing byte, while the two sibling verifiers
  ([tribute-webhook.ts](app/api/tribute-webhook.ts) and
  [admin-grant.ts](app/api/admin-grant.ts)) already used an XOR-accumulator loop.
- **Not exploitable:** forging a hash requires the bot token's derived key, and
  remote timing signal on Edge is buried under network jitter. Fixed for
  consistency across the three verifiers, not because an attack path existed.
- **Fix:** replaced with the same length check + XOR-accumulator compare used
  elsewhere in the codebase.

### 2. `.DS_Store` tracked in git; no root `.gitignore` — FIXED 2026-09-04

- **Severity:** Housekeeping, not a vulnerability.
- A `.gitignore` existed only in `app/`, so the repository root had none and
  `.DS_Store` was committed.
- **Fix:** added a root `.gitignore` covering `.DS_Store`, `node_modules`,
  `dist`, `.vercel` and `.env*` (the last so `ADMIN_SECRET`, `TELEGRAM_BOT_TOKEN`
  and the KV credentials cannot be committed by accident), and removed
  `.DS_Store` from the index with `git rm --cached`. Verified `.env.example` is
  a template with every value blank — no secret was ever committed.
