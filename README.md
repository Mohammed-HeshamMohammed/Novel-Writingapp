# Novel-Writingapp

An offline-first writing app for organizing novels: chapters, characters,
locations, and a timeline, all editable from a single dashboard. Built as a
web app (deployable to Netlify) that can also run as a desktop app via
Electron, with an optional FastAPI backend for save/import/export.

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
│   │   └── utils/             localStorage persistence, word-count helpers
│   └── assets/
├── backend/                  FastAPI service for save/import/export (optional)
│   └── app/
│       ├── main.py           App entrypoint, CORS, router wiring
│       ├── core/config.py    Settings
│       └── api/routes/       Route modules
├── desktop/                  Electron shell that wraps the built web app
│   ├── main.cjs
│   └── package.json          Separate deps so the web build stays lean
├── public/
├── netlify.toml               Netlify build config
└── package.json               Frontend deps + scripts (this is what Netlify builds)
```

The guiding rule: **the root `package.json` only contains what the deployed
web app needs.** Electron and its dependencies live in `desktop/` so that
`npm install` at the repo root — which is what Netlify runs — never has to
touch Electron's (large, platform-specific) binary download.

## Getting started

### Web app

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run build` (type-check + production build to `dist/`),
`npm run preview` (serve the production build locally), `npm run lint`.

### Desktop app (Electron)

```bash
npm --prefix desktop install
npm run desktop     # starts the Vite dev server and an Electron window together
```

For a packaged build, run `npm run build` at the repo root first (so
`dist/` exists), then `npm --prefix desktop run electron`.

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

## Deploying to Netlify

The repo root is the Netlify base directory. `netlify.toml` sets:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

Connect the repo in Netlify and it builds with no further configuration. If
you wire up the FastAPI backend, set `VITE_API_URL` as a Netlify environment
variable so the deployed frontend can reach it.

## Tech stack

| Layer    | Tech                                   |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Desktop  | Electron                                |
| Backend  | FastAPI (Python)                        |
| Storage  | `localStorage` (offline-first); backend persistence is a stub — swap for a real database when you need it |

## Known gaps

- The backend's story store is in-memory (resets on restart) and EPUB
  import isn't implemented yet — both are called out with comments/errors
  at the relevant code, not silently faked.
- `npm run lint` reports a number of pre-existing `no-explicit-any`
  warnings in the sidebar and navigation components; worth tightening up
  incrementally rather than in one large pass.
