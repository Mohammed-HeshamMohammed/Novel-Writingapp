# 📝 Novel-Writingapp – Your Offline AI-Powered Writing Assistant

**Novel-Writingapp** is a full-featured, offline-first, privacy-respecting desktop app built for novelists, storytellers, and roleplay writers. With a React + Tailwind frontend and FastAPI backend, it lets you structure entire projects, track characters and plot, and optionally leverage AI assistance when you need it — without cloud lock-in.

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

![Feature Breakdown Graph](feature_breakdown_bar.png)

*Modules like Character Management and Chapter Tools are the most feature-rich.*

---

## 🧠 Optional AI Assistance

Use AI only when you need it:
- Trigger dialogue suggestions, rewriting, or plot ideas manually
- Token-efficient prompt structure
- Scoped memory per chapter/project
- Roleplay-compatible AI behavior

---

## 🛠 Tech Stack

| Layer       | Tech                             |
|-------------|----------------------------------|
| Frontend    | React.js + TailwindCSS + Vite    |
| Desktop     | Electron.js                      |
| Backend     | FastAPI (Python)                 |
| Storage     | Local filesystem                 |
| AI Engine   | Token-managed LLM (manual trigger) |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mohammed-HeshamMohammed/Novel-Writingapp.git
cd Novel-Writingapp
