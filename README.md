# Vesper — Next.js

Private sports & lifestyle platform homepage. Full-screen interactive
four-column reveal, centered logo, Request Access modal.

## Stack
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## File tree
```
vesper-nextjs/
├─ app/
│  ├─ globals.css        # resets, fonts, keyframes, hover/focus rules
│  ├─ layout.tsx         # <head> fonts + metadata (SEO title/description)
│  └─ page.tsx           # renders <VesperHome/>
├─ components/
│  └─ VesperHome.tsx     # the whole homepage (client component)
├─ public/
│  └─ assets/            # ← all images live here (see below)
├─ package.json
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
├─ next.config.mjs
└─ next-env.d.ts
```

## Images — where they go
All five images are already in `public/assets/`. They are referenced
with absolute paths (`/assets/...`), which Next.js serves from `public/`.

| File                         | Column / role                         |
|------------------------------|---------------------------------------|
| `vesper-logo.png`            | Centered logo (transparent PNG)       |
| `col-pressure.png`           | Column 01 — Pressure (athlete tunnel) |
| `col-access.png`             | Column 02 — Access (private doorway)  |
| `col-performance.png`        | Column 03 — Performance (cockpit)     |
| `col-culture.png`            | Column 04 — Culture (candlelit dinner)|

To swap an image, drop a new file with the same name into
`public/assets/` (or change the path in `components/VesperHome.tsx`,
`COLUMNS` array). Per-column crop is set via the `pos` value there.

## v0 / Vercel
- Import the folder into v0, or push to a GitHub repo and import in Vercel.
- No env vars, no API routes. The Request Access form is front-end only
  (shows a confirmation state); wire it to your backend/email when ready.

## Notes
- The four column images are hidden by default (~96% dark overlay) and
  only reveal on hover (desktop) / tap (mobile).
- Fonts (Cormorant Garamond + Hanken Grotesk) load from Google Fonts in
  `app/layout.tsx`.
