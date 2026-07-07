# Novel-Writingapp

An offline-first writing app for organizing novels: chapters, characters,
locations, and a timeline, all editable from a single dashboard. Built as a
web app (deployable to Netlify) that can also run as a desktop app via
Tauri, with an optional FastAPI backend for save/import/export.

## Project structure

```
Novel-Writingapp/
├── src/                      Frontend (React + TypeScript + Vite + Tailwind)
│   ├── app/                  App shell: root component, theme provider
│   ├── features/             One folder per feature area
│   │   ├── home/             Story dashboard, filters, story cards
│   │   ├── editor/           Chapter editor, story editor, settings popup
│   │   ├── navigation/       Top nav bars, notifications, user dropdown
│   │   ├── sidebar-left/     Chapters/characters/locations/timeline panel
│   │   ├── sidebar-right/    Writing suggestions/analytics/history panel
│   │   └── fun/              Easter-egg components
│   ├── shared/                Code reused across features
│   │   ├── components/       Generic UI (e.g. ThemeToggle)
│   │   ├── types/             Shared TypeScript types (Story, Chapter, ...)
│   │   ├── utils/             localStorage persistence, word-count helpers
│   │   └── services/          Supabase client
│   └── assets/
├── backend/                  FastAPI service for save/import/export (optional)
│   └── app/
│       ├── main.py           App entrypoint, CORS, router wiring
│       ├── core/config.py    Settings
│       └── api/routes/       Route modules
├── src-tauri/                 Tauri desktop shell (Rust) that wraps the built web app
│   ├── src/                   Rust entrypoint (lib.rs, main.rs)
│   ├── tauri.conf.json        Window config, dev/build commands, bundle targets
│   └── Cargo.toml
├── public/
├── netlify.toml               Netlify build config
└── package.json               Frontend deps + scripts (this is what Netlify builds)
```

The guiding rule: **the root `package.json` only contains what the deployed
web app needs.** The desktop shell's Rust toolchain and dependencies live
entirely under `src-tauri/` (its own `Cargo.toml`), so `npm install` at the
repo root — which is what Netlify runs — never has to touch anything
desktop-related. `@tauri-apps/cli` is a small dev dependency at the root
purely to drive `npm run tauri ...`; it doesn't pull in Rust itself.

## Getting started

### Web app

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run build` (type-check + production build to `dist/`),
`npm run preview` (serve the production build locally), `npm run lint`.

### Desktop app (Tauri)

Requires the Rust toolchain ([rustup.rs](https://rustup.rs)) plus the OS
webview dependencies for your platform (see the
[Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/) —
on Linux that's `webkit2gtk`, `gtk3`, etc.).

```bash
npm install
npm run tauri dev     # starts the Vite dev server and a native window together
```

For a distributable build (installer/AppImage/etc.):

```bash
npm run tauri build
```

This runs `npm run build` first (per `beforeBuildCommand` in
`tauri.conf.json`) and bundles `dist/` into the native app.

### Backend (optional, for save/import/export)

The editor's Save/Import/Export buttons call a backend at
`VITE_API_URL` (default `http://127.0.0.1:8000` — see `.env.example`).
Without a backend running, everything else in the app still works: stories
are persisted to `localStorage` regardless.

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

See `backend/README.md` for endpoint details and what's still a stub
(the in-memory story store, EPUB import).

### Supabase (optional, for a hosted database)

`src/shared/services/supabase.ts` creates a Supabase client from
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (see
`.env.example`). Copy real values into a local `.env.local` (gitignored,
never committed). If unset, `supabase` is exported as `null` and
`isSupabaseConfigured` is `false`, and `src/shared/utils/storage.ts` falls
back to `localStorage` — the app works fully offline either way.

When Supabase *is* configured, `storage.ts` reads/writes stories to a
`stories` table instead of `localStorage`. That table doesn't exist until
you run the migration: open the Supabase SQL Editor for your project and
run `supabase/migrations/0001_stories.sql`.

**Before you do, read the warning at the top of that file.** There's no
authentication in this app yet, so the migration's RLS policies allow
anyone with the publishable key (i.e. anyone who loads the deployed site)
to read and write every row in that table — it's a shared/public table,
not per-user private storage. That's fine for a demo or a single-user
deployment you control; if you need real privacy per visitor, add
Supabase Auth and scope the policies to `auth.uid()` first.

## Mobile & tablet navigation

Below the `md` breakpoint (768px), both the home dashboard and the editor
switch from a single top nav to a top nav + fixed bottom nav pair, so the
primary actions (search, create, notifications on home; import/export/save
on the editor) sit in thumb reach instead of a crowded top bar:

- `features/navigation/home/MobileBottomNav.tsx` — Home / Search / Create / Notifications
- `features/navigation/editor/EditorMobileBottomNav.tsx` — Import / Export / Save / Settings

The writing-mode selector in the editor becomes a horizontal scroll row on
mobile instead of disappearing. Desktop (`md:` and up) is unchanged.

## Deploying to Netlify

The repo root is the Netlify base directory. `netlify.toml` sets:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

Connect the repo in Netlify and it builds with no further configuration.
Set any of `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
as Netlify environment variables (Site settings > Environment variables) if
you want the deployed frontend to reach a backend and/or Supabase project —
Vite only inlines `VITE_`-prefixed variables that are present at build time.

## Tech stack

| Layer    | Tech                                   |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Desktop  | Tauri (Rust + OS-native webview)         |
| Backend  | FastAPI (Python)                        |
| Storage  | `localStorage` (offline-first) + optional Supabase |

## Known gaps

- The backend's story store is in-memory (resets on restart) and EPUB
  import isn't implemented yet — both are called out with comments/errors
  at the relevant code, not silently faked.
- The Supabase `stories` table has no per-user privacy (see the Supabase
  section above) — there's no auth yet, so it's a shared table.
- `npm run lint` reports a number of pre-existing `no-explicit-any`
  warnings in the sidebar and navigation components; worth tightening up
  incrementally rather than in one large pass.
- The profile menu isn't duplicated into the mobile bottom nav (it stays
  in the top nav on every breakpoint) — only search/create/notifications
  moved down, to keep the bottom nav to 4 items.
