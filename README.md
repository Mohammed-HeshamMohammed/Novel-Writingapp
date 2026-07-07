# 📝 Novel-Writingapp – Your Offline AI-Powered Writing Assistant

**Novel-Writingapp** is a full-featured, offline-first, privacy-respecting desktop and web app built for novelists, storytellers, and roleplay writers. With a React + Tailwind frontend, Tauri desktop integration, and FastAPI backend, it lets you structure entire projects, track characters and plot, and optionally leverage AI assistance when you need it — without cloud lock-in.

---

## ⚙️ Core Feature Highlights

### 1. ✏️ Chapter & Scene Management
- Multi-level chapter → scene hierarchy
- Reorder with drag-and-drop
- Collapse/expand for cleaner workflow
- Label scenes by tone (Romance, Reveal, Tension, etc.)
- Track word counts per scene and chapter
- Visual progress indicators

### 2. 🧙‍♀️ Character Management System
- Full profile: name, age, role, personality, backstory
- Relationship mapping and appearance tracking
- Link characters to scenes/chapters
- View chapters by character presence
- Filter: “Show chapters without this character”
- Built-in search

### 3. 🧾 Story Metadata & Tags
- Project-level metadata: title, genre, author, theme
- Word count goals per chapter & overall
- Series title and status tracking (Draft, Editing, Final)
- Last modified timestamps
- Custom tags

### 4. 🌍 Worldbuilding Notes System
- Create notes for locations, factions, magic, tech, etc.
- Rich text support: lists, bold, links, code blocks
- Tag with icons or colors
- Link to chapters and characters
- Full-text search

### 5. 🎯 Goal Tracking & Writing Stats
- Set daily and weekly writing goals (word/time-based)
- Track progress per session and scene
- Session history log
- Visual progress bars

### 6. 🧱 Draft History & Versioning
- Auto-save on every change
- View or restore past versions
- Tag versions (e.g. First Draft, Pre-Edit)
- Full rollback support

### 7. 🎭 Plot & Story Arc Tools
- Add plot points (inciting incident, climax, etc.)
- Organize by arc (Main plot, Subplot A/B/C)
- Timeline view
- Scene-arc mapping
- Chapter coverage insights

### 8. 🧩 Outline & Index Card View
- Story outline view: chapter, scene, synopsis
- Index cards: freeform drag-and-drop
- Printable/exportable outlines

### 9. 🗂 Project Dashboard
- List view of all stories
- Filter by status, genre, last edited
- Add cover images to each project
- Quick access to recent projects

### 10. 📤 Export-Ready Manuscript Tools
- Export full or partial manuscripts as `.txt`, `.pdf`, or `.epub`
- Custom export settings: include/exclude metadata
- Formatting options: font, spacing, chapter breaks
- Auto-generated title page

---

## 📊 Functional Feature Breakdown

The chart below illustrates the number of internal features per core writing module:

| Module                    | Feature Count | Visual Representation      |
|---------------------------|---------------|----------------------------|
| Chapter & Scene Manager   | 6             | ██████                    |
| Character Management      | 6             | ██████                    |
| Story Metadata            | 5             | █████                     |
| Worldbuilding Notes       | 4             | ████                      |
| Writing Stats             | 4             | ████                      |
| Draft History             | 4             | ████                      |
| Plot & Arc Tools          | 4             | ████                      |
| Outline & Index View      | 3             | ███                       |
| Project Dashboard         | 4             | ████                      |
| Export Tools              | 4             | ████                      |

> Text-based bars are approximate visual indicators.

---

## 🧠 Optional AI Assistance

Use AI only when you need it:
- Trigger dialogue suggestions, rewriting, or plot ideas manually
- Token-efficient prompt structure
- Scoped memory per chapter/project
- Roleplay-compatible AI behavior

---

## 📁 Project Structure

```text
Novel-Writingapp/
├── src/                      Frontend (React + TypeScript + Vite + Tailwind)
│   ├── app/                  App shell: root component, theme provider
│   ├── features/             One folder per feature area
│   │   ├── auth/             Supabase-backed login/signup (email + Google)
│   │   ├── home/             Story dashboard, filters, story cards, dropdown modals
│   │   ├── editor/           Chapter editor, story editor, settings popup
│   │   ├── navigation/       Top/bottom nav bars, notifications, user dropdown
│   │   ├── sidebar-left/     Chapters/characters/locations/timeline panel
│   │   ├── sidebar-right/    Writing suggestions/analytics/history panel
│   │   └── fun/              Easter-egg components
│   ├── shared/               Code reused across features
│   │   ├── components/       Generic UI (e.g. ThemeToggle)
│   │   ├── types/            Shared TypeScript types (Story, Chapter, ...)
│   │   ├── utils/            localStorage persistence, word-count helpers
│   │   └── services/         Supabase client
│   └── assets/
├── desktop/                  Desktop app-related codebase
│   ├── frontend/             Vite/React frontend copy used by the Tauri desktop shell
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   ├── backend/              FastAPI service for save/import/export (optional)
│   │   └── app/
│   │       ├── main.py       App entrypoint, CORS, router wiring
│   │       ├── core/config.py Settings
│   │       └── api/routes/   Route modules
│   └── src-tauri/            Tauri desktop shell (Rust) wrapping the built frontend
│       ├── src/              Rust entrypoint (lib.rs, main.rs)
│       ├── tauri.conf.json   Window config, dev/build commands, bundle targets
│       └── Cargo.toml
├── public/
├── netlify.toml              Netlify build config
└── package.json              Frontend deps + scripts (builds root app on Netlify)
```

The guiding rule: **the root `package.json` only contains what the deployed web app needs.** The desktop shell's Rust toolchain and dependencies live entirely under `desktop/src-tauri/` (its own `Cargo.toml`), so `npm install` at the repo root — which is what Netlify runs — never has to touch anything desktop-related. `@tauri-apps/cli` is a small dev dependency at the root purely to drive `npm run tauri ...` scripts.

---

## 🛠 Tech Stack

| Layer       | Tech                                                  |
|-------------|-------------------------------------------------------|
| Frontend    | React 18 + TailwindCSS + Vite + TypeScript            |
| Desktop     | Tauri (Rust + OS-native webview wrapper)              |
| Backend     | FastAPI (Python)                                      |
| Storage     | Local filesystem / `localStorage` + optional Supabase |
| AI Engine   | Token-managed LLM (manual trigger)                    |

---

## 🚀 Getting Started

### 1. Web App

To run the web version of the application:
```bash
npm install
npm run dev        # Runs on http://localhost:5173
```
Other scripts: `npm run build` (type-check + production build to `dist/`), `npm run preview` (serve the production build locally), `npm run lint`.

### 2. Desktop App (Tauri)

Requires the Rust toolchain ([rustup.rs](https://rustup.rs)) plus the OS webview dependencies for your platform (see the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/)).

```bash
# Install root dependencies
npm install

# Install desktop frontend dependencies
cd desktop/frontend && npm install

# Return to root and run Tauri
cd ../..
npm run tauri dev     # starts the Vite dev server and a native window together
```

For a distributable build (installer/AppImage/etc.):
```bash
npm run tauri build
```
This runs `npm run build` first (per `beforeBuildCommand` in `tauri.conf.json`) and bundles the static assets.

### 3. Backend (optional, for save/import/export)

The editor's Save/Import/Export buttons call a backend at `VITE_API_URL` (default `http://127.0.0.1:8000`). Without a backend running, everything else in the app still works: stories are persisted to `localStorage` or Supabase.

```bash
cd desktop/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
See `desktop/backend/README.md` for endpoint details and what's still a stub (the in-memory story store, EPUB import).

### 4. Supabase (optional, for a hosted database + accounts)

The file `src/shared/services/supabase.ts` creates a Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`). If unset, the app skips auth entirely and falls back to `localStorage` (works fully offline).

When Supabase **is** configured, two things change:
1. The app gates on sign-in (`src/features/auth/`) — email/password or "Continue with Google".
2. Story saving reads/writes to the `stories` table scoped to the user, and reads user profile details from the `profiles` table.

To set up your database, run the SQL migration in your Supabase SQL Editor:
`supabase/migrations/0001_stories.sql`

---

## 📱 Mobile & Tablet Navigation

Below the `md` breakpoint (768px), both the home dashboard and the editor switch from a single top nav to a top nav + fixed bottom nav pair:
- `features/navigation/home/MobileBottomNav.tsx` — Home / Search / Create / Notifications
- `features/navigation/editor/EditorMobileBottomNav.tsx` — Import / Export / Save / Settings

The writing-mode selector in the editor becomes a horizontal scroll row on mobile instead of disappearing.

---

## ☁️ Deploying to Netlify

The repo root is the Netlify base directory. `netlify.toml` automatically configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

Connect the repo in Netlify to build. Set environment variables (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) in your Netlify panel if your deployment needs to connect to live backends.

---

## ⚠️ Known Gaps
- The backend's story store is in-memory (resets on restart) and EPUB import is pending implementation.
- Google sign-in requires enabling the provider with real OAuth credentials in the Supabase dashboard.
- Password-reset flows and email verification are governed by Supabase settings.
- Pre-existing lint warnings in the sidebar components are being incrementally resolved.
