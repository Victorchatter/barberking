# THE BARBER KING — Website

> Built by Orvexis IV · Next.js 16 · TypeScript · Tailwind CSS v4

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Real photos needed — placeholder slots

Drop Victor's photos directly into these paths. Filenames must match exactly.
No code changes needed — the components already reference these paths.

### Hero
| Path | What to put there |
|------|-------------------|
| `public/images/hero/hero-main.jpg` | Shop interior or barber at work — full bleed, landscape |

### Barbers (portrait, ~3:4 ratio)
| Path | Who |
|------|-----|
| `public/images/barbers/ilker.jpg` | Ilker |
| `public/images/barbers/emran.jpg` | Emran |
| `public/images/barbers/toni.jpg` | Toni |
| `public/images/barbers/borko.jpg` | Borko |

### Gallery (mix of haircut results, beard work, interior)
`public/images/gallery/g01.jpg` through `g09.jpg` — any orientation, the grid handles it.

### Logo
| Path | Use |
|------|-----|
| `public/images/logo/logo.png` | Optional — currently uses text mark in navbar |

All images are rendered via `next/image` (automatic WebP conversion, lazy-loading). Original files can be JPG or PNG.

---

## Opening hours confirmed from Google Maps (2026-06-25)

| Day | Hours |
|-----|-------|
| Monday–Saturday | 09:30 – 18:30 |
| Sunday | Closed |

Previously believed: Mon–Sat 09:00 – 18:30. **Actual open is 09:30**, not 09:00.

---

## Accessibility note

Google Maps listing shows the accessibility icon suggesting NO wheelchair access at entrance. The client brief says "wheelchair-accessible parking and entrance." **Verify with the client before publishing** — the Location section currently shows "Accessible parking · Toilet on site."

---

## Booking notifications — configure before go-live

Edit `app/api/booking/route.ts`. The comments inside show three options:

1. **Resend email** (recommended) — add `RESEND_API_KEY` and `OWNER_EMAIL` to `.env.local`
2. **Telegram bot** — add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
3. **Local NDJSON log** — zero-infra fallback for development

Add persistence (Google Sheet / Supabase) using the comments in the same file.

---

## Environment variables

Create `.env.local` (not committed):

```
# Booking notifications (choose one)
RESEND_API_KEY=re_...
OWNER_EMAIL=owner@example.com

# OR Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# GA4 (add measurement ID to layout.tsx when ready)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

---

## Bilingual (BG/EN)

All strings live in `locales/bg.json` and `locales/en.json`.
- Default language: **Bulgarian**
- Toggle: navbar BG/EN button — no page reload, no scroll jump
- State persists in `localStorage` key `bk-lang`

---

## Service prices

Services show `— лв / — BGN` placeholders. Fill in actual prices in `locales/bg.json` and `locales/en.json` under `services.items[].price` (add the field) and update the Services component to display it.

---

## Phase 2 upsell opportunity — live calendar sync

The booking wizard is a *request-an-appointment* flow (no double-booking protection yet). Phase 2: connect to Google Calendar or Cal.com for real-time slot availability — pairs naturally with Orvexis IV's own AI-agent calendar product.

---

## GitHub

```bash
git remote add origin https://github.com/Victorchatter/barberking
git push -u origin main
```
