# 🎨 Novelist – User Interface (UI) & User Experience (UX) Description

Novelist features a premium, modern, and distraction-free design system optimized for creative writing. It balances deep dark mode themes, clean card layouts, glassmorphic menus, and highly reactive micro-animations to create a premium user experience across all devices.

---

## 🎨 1. Visual Identity & Aesthetics

### A. Dark & Light Theme Modes
- **Obsidian Dark Mode (Default)**: Uses deep charcoal and obsidian hues (`bg-gray-950`/`bg-gray-900`) for the canvas. Interactive panels utilize semi-transparent card layers (`bg-gray-900/50` or `bg-slate-900/80` with a `backdrop-blur-md` filter). Text uses soft slate colors to eliminate eye strain during prolonged writing sessions.
- **Paper Light Mode**: Switches to a clean warm-white and ivory backdrop (`bg-gray-50`/`bg-white/60`) paired with charcoal typography (`text-gray-900`).
- **Responsive Switcher**: Instantly toggles between themes via an icon button (Sun/Moon) on mobile/tablet screens and a sliding track switch on desktop screens.

### B. Glassmorphism & Translucency
- Header bars, context drawers, and dropdown lists overlay the background with a `backdrop-filter: blur(16px)` layer. Variable-opacity borders (`border-white/5` or `border-gray-200/50`) give components a physical, floating depth.

### C. Tier-Based Neon Glow Animation
- The profile card inside the avatar dropdown highlights the user's membership tier with a slow, pulsing neon glow animation (`@keyframes flashyGlow`). The border glow color adapts based on the active plan:
  - **Premium Plan**: Warm gold pulsing glow (`rgba(251, 191, 36, 0.45)`)
  - **Pro Plan**: Electric purple neon glow (`rgba(139, 92, 246, 0.45)`)
  - **Free Plan**: Deep blue cosmic glow (`rgba(59, 130, 246, 0.3)`)

---

## 📱 2. Layout Architecture & Responsive UX

The interface adapts dynamically across viewport sizes to ensure a consistent, non-cluttered workflow:

```
+-------------------------------------------------------+
| Desktop (>= 1024px)                                   |
| - Fixed Top Navigation Header                         |
| - Left Sidebar (Chapters/Manuscript Outline Tree)     |
| - Main Writing Canvas (Editor View)                   |
| - Right Sidebar (AI / Version Checkpoints)            |
+-------------------------------------------------------+
| Tablet (768px - 1023px)                               |
| - Top Navbar showing Search + Notifications           |
| - Collapsible sidebars (drawers overlaying canvas)     |
| - Floating center navigation pill at bottom           |
+-------------------------------------------------------+
| Mobile (< 768px)                                      |
| - Compact Top Header (Avatar, Alerts, Search Toggle)  |
| - Centered Floating Pill Navigation at bottom         |
| - Fullscreen bottom sheets for modal popups           |
+-------------------------------------------------------+
```

### A. The Floating Pill Bottom Navigation (Mobile/Tablet)
- Instead of a traditional full-width bottom bar, the navigation is styled as a sleek, floating pill centered at the bottom of the screen.
- Buttons scale up slightly on hover (`hover:scale-105`) and contract on tap/click (`active:scale-95`).
- Displays 5 core icons: **Home**, **Characters**, **Add Story (+)**, **Settings**, and **Profile**.

### B. Interactive Top Header (Mobile/Tablet)
- Features a minimized header branding alongside action items:
  - **Search Icon**: Toggles a search overlay drawer directly below the header.
  - **Notification Bell**: Displays unread alerts and opens the portal-mounted notifications menu.
  - **Theme Toggle**: Switch between dark/light state with a single tap.
  - **User Profile**: Access plans, characters, and settings.

---

## 📝 3. Distraction-Free Manuscript Editor

The center writing canvas is designed to support different focus intensities:

- **Tone-Labeling Chips**: Scenes can be tagged with emotional tone markers (e.g., romance, climax, suspense). These color-coded chips allow authors to scan their manuscript's pacing visually.
- **Outline Index Cards**: The outline view groups chapter synopses as index cards that can be reordered or annotated in a split screen.
- **Scroll-Snapping Genre Bar**: The dashboard features a horizontal genre selection row with 20+ genre chips. Left/right gradient shadow overlays have been removed to expose buttons near screen edges.

---

## 🖱 4. Micro-Interactions & Popups

- **Auto-Cancel Outside Clicks**: All floating panels and dropdown menus (`StatusDropdown`, `NotificationCenter`, `UserProfileDropdown`) listen to both click (`mousedown`) and tap (`touchstart`) events. Touching outside automatically cancels the active state.
- **Portal Rendering**: Overlay dropdown menus are mounted inside `<FloatingPortal>` elements to prevent truncation, layout breaking, or scrolling overlap issues caused by parent containers.
- **Story Card Hover Effects**: Story preview cards smoothly slide upward (`translate-y-[-4px]`) and increase box shadow intensity on cursor hover, drawing focus.

---

## 📄 5. Application Pages & Interactive Screens

Novelist coordinates several interactive pages and modals, rendering them dynamically depending on the current application state and user options:

### 🔑 A. Authentication Gateway (`src/features/auth/`)
- **Login & Register Views**: Clean, card-based interface centered on a gradient background. Allows secure authentication via Email/Password or single-click OAuth integrations like "Continue with Google".
- Fully supports local fallback bypass for offline usage, redirecting straight to the dashboard without gating the writer.

### 🗂 B. Creative Dashboard / Home Page (`src/features/home/`)
- **Manuscript Grid**: Lists all current stories as interactive cards. Cards display custom book covers, current word counts, tag chips, and a quick-action bookmark star.
- **Discover Toolbar**: Combines the scroll-snapping GenreNavBar with story filter controls, sort indicators (by word count, popularity, date), and layout switches (Grid vs. List).
- **Project Setup Dialog**: Prompts for title, target genre, description, cover image, and initial writing goals when starting a new story draft.

### 📝 C. The Manuscript Workspace / Editor (`src/features/editor/`)
- **Central Writing Canvas**: A rich-text writing canvas featuring distraction-free toggle modes. Adjusts width, padding, text sizes, and font styles automatically based on the user's Preferences settings.
- **Left Panel (Structural Blueprint)**: Contains tabbed side drawers for:
  - **Chapters & Scenes**: Nested outline view with drag-and-drop reordering.
  - **Characters & Locations**: Fast link tags that highlight matching world notes.
  - **Timeline**: Graphic representation of story milestones.
- **Right Panel (Writing Assistant)**: Houses the interactive AI prompts drawer, daily statistics graphs, and version rollback checkpoints list.

### 🧙‍♀️ D. Character Vault (`src/features/home/components/`)
- **Characters List Modal**: Shows a visual gallery of all characters created in the workspace, detailing name, age, core description, and quick-delete actions.
- **Create Character Sheet**: Form inputs to configure character traits (biography, traits, relationships, role) with responsive validation.

### 🌟 E. Interactive Modals & Preference Layers
- **Creator Profile Card**: High-fidelity popup displaying a subscription tier colored header banner, large avatar display, and user statistics panels (stories count, characters count, user status). Features an inline **Edit Details** panel toggle.
- **Writing Preferences Modal**: Houses toggles for auto-save, spell check, and soft wraps alongside grid-based typography family and size selector cards.
- **Pricing Packages Modal**: Compares benefits (Pro, Premium, Free Tier) in a multi-column pricing table with quick upgrade buttons.
