# 📋 Project Tasks & Roadmap

This document outlines the features of **Novel-Writingapp** and tracks their implementation status.

---

## 🛠 Feature Dashboard

| Module | Implemented | Pending | Progress |
| :--- | :---: | :---: | :---: |
| 1. Chapter & Scene Management | 4 | 2 | 66% |
| 2. Character Management System | 4 | 2 | 66% |
| 3. Story Metadata & Tags | 4 | 1 | 80% |
| 4. Worldbuilding Notes System | 3 | 2 | 60% |
| 5. Goal Tracking & Writing Stats | 2 | 2 | 50% |
| 6. Draft History & Versioning | 1 | 3 | 25% |
| 7. Plot & Story Arc Tools | 1 | 4 | 20% |
| 8. Outline & Index Card View | 0 | 3 | 0% |
| 9. Project Dashboard | 3 | 1 | 75% |
| 10. Export-Ready Manuscript Tools | 1 | 3 | 25% |

---

## 📝 Detailed Feature Task List

### 1. ✏️ Chapter & Scene Management
- [x] Multi-level chapter → scene hierarchy
- [ ] Reorder with drag-and-drop
- [x] Collapse/expand for cleaner workflow
- [ ] Label scenes by tone (Romance, Reveal, Tension, etc.)
- [x] Track word counts per scene and chapter
- [x] Visual progress indicators

### 2. 🧙‍♀️ Character Management System
- [x] Full profile: name, age, role, personality, backstory
- [ ] Relationship mapping and appearance tracking
- [x] Link characters to scenes/chapters
- [ ] View chapters by character presence
- [ ] Filter: “Show chapters without this character”
- [x] Built-in search

### 3. 🧾 Story Metadata & Tags
- [x] Project-level metadata: title, genre, author, theme
- [ ] Word count goals per chapter & overall
- [x] Series title and status tracking (Draft, Editing, Final)
- [x] Last modified timestamps
- [x] Custom tags

### 4. 🌍 Worldbuilding Notes System
- [x] Create notes for locations, factions, magic, tech, etc.
- [x] Rich text support: lists, bold, links, code blocks
- [ ] Tag with icons or colors
- [ ] Link to chapters and characters
- [x] Full-text search

### 5. 🎯 Goal Tracking & Writing Stats
- [ ] Set daily and weekly writing goals (word/time-based)
- [x] Track progress per session and scene
- [ ] Session history log
- [x] Visual progress bars

### 6. 🧱 Draft History & Versioning
- [x] Auto-save on every change
- [ ] View or restore past versions
- [ ] Tag versions (e.g. First Draft, Pre-Edit)
- [ ] Full rollback support

### 7. 🎭 Plot & Story Arc Tools
- [ ] Add plot points (inciting incident, climax, etc.)
- [ ] Organize by arc (Main plot, Subplot A/B/C)
- [x] Timeline view (Events sidebar panel)
- [ ] Scene-arc mapping
- [ ] Chapter coverage insights

### 8. 🧩 Outline & Index Card View
- [ ] Story outline view: chapter, scene, synopsis
- [ ] Index cards: freeform drag-and-drop
- [ ] Printable/exportable outlines

### 9. 🗂 Project Dashboard
- [x] List view of all stories
- [x] Filter by status, genre, last edited
- [ ] Add cover images to each project
- [x] Quick access to recent projects

### 10. 📤 Export-Ready Manuscript Tools
- [x] Export full or partial manuscripts as `.txt`, `.pdf`, or `.epub` (FastAPI backend export hooks)
- [ ] Custom export settings: include/exclude metadata
- [ ] Formatting options: font, spacing, chapter breaks
- [ ] Auto-generated title page
