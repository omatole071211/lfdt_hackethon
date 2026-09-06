# 🎨 CampusSpace / RoomRadar — Frontend Technical Specification (`frontend.md`)

## 📌 1. System Overview

**CampusSpace / RoomRadar** frontend is a high-performance, real-time single-page web application (SPA) built with **React 19**, **TypeScript**, and **Vite**. It provides students, faculty, and campus administrators with live visibility into classroom and computer lab availability across multiple campus buildings, floors, and time slots.

---

## 🏗️ 2. Architectural Blueprint & Component Hierarchy

```text
src/
├── assets/                       # Static assets & vectors
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Navigation, Live Clock badge, Dark/Light toggle, Wizard trigger
│   │   └── AnalyticsBanner.tsx   # Campus metrics counters (Total, Free, Occupied, Free Labs)
│   ├── filters/
│   │   └── ControlPanel.tsx      # Live/Custom mode switch, Day/Time selector, Building dropdown, Floor tabs, Room type pills, Search bar
│   ├── rooms/
│   │   ├── RoomGrid.tsx          # Filterable view tabs (All, Available, Occupied) & Grid layout
│   │   └── RoomCard.tsx          # Room status card, equipment pills, ongoing session details, duration timers
│   └── modals/
│       ├── RoomDetailDrawer.tsx  # Slide-out drawer with full room equipment specs & daily schedule timeline
│       ├── WeeklyTimetableModal.tsx # Interactive Monday–Saturday schedule matrix grid
│       └── RecommendationModal.tsx  # Smart wizard ("Find Me a Free Room Now") with scoring preferences
├── data/
│   └── mockData.ts               # Offline fallback dataset (Buildings, Rooms, Master Timetable)
├── hooks/
│   ├── useLiveTime.ts            # Ticking real-time clock hook with day/time resolution
│   └── useTimetableEngine.ts     # Core state hook managing filters, evaluation logic, and modals
├── services/
│   └── apiService.ts             # API client connecting frontend to backend REST endpoints with mock fallback
├── types/
│   └── index.ts                  # TypeScript interfaces for Room, Building, ScheduleSlot, FilterState, Recommendations
├── utils/
│   ├── timeHelpers.ts            # Military time parsing, 12h formatting, duration calculation
│   └── timetableEngine.ts        # Client-side status resolver & recommendation wizard engine
├── App.tsx                       # Main application shell
├── index.css                     # Comprehensive CSS design system with Dark/Light mode tokens
└── main.tsx                      # Vite React entry point
```

---

## 🎨 3. UI/UX Design System & Color Palette

The interface is built using Vanilla CSS with CSS custom properties, glassmorphism, dynamic gradients, smooth micro-interactions, and status indicators:

### Color Palette (CSS Variables)

| Token | Light Theme Value | Dark Theme Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-main` | `#F8FAFC` | `#0B0F19` | Main application background |
| `--bg-surface` | `#FFFFFF` | `#131B2E` | Card & container surfaces |
| `--border-color` | `#E2E8F0` | `#1E293B` | Borders & section dividers |
| `--primary` | `#4F46E5` | `#6366F1` | Brand primary color (Indigo) |
| `--accent-green` | `#10B981` | `#34D399` | **AVAILABLE** status & badges |
| `--accent-red` | `#F43F5E` | `#FB7185` | **OCCUPIED** status & active class |
| `--accent-indigo` | `#6366F1` | `#818CF8` | Computer Lab badges |
| `--accent-amber` | `#F59E0B` | `#FBBF24` | Seminar Hall badges |

### Status Badges & Accents
- 🟢 **Available Room**: Emerald green top accent line, green icon indicator, *"Free until [Time] ([Duration] left)"* box.
- 🔴 **Occupied Room**: Rose red top accent line, ongoing session block with Subject Code (e.g. `CS201`), Subject Name, Instructor Name, Batch, and End Time.

---

## ⚙️ 4. State Management & Hooks

### `useLiveTime`
- Maintains a ticking `Date` object updated every 10 seconds.
- Provides `dayOfWeek` (e.g. `'Monday'`) and `time24h` string (e.g. `'10:30'`).

### `useTimetableEngine`
- Holds user filter state (`isLiveMode`, `selectedDay`, `selectedTime`, `selectedBuilding`, `selectedFloor`, `selectedType`, `searchQuery`).
- Evaluates active evaluation day & time (Live clock vs custom picked day/time).
- Computes filtered room availability list and campus summary analytics.
- Controls selection states for `RoomDetailDrawer`, `WeeklyTimetableModal`, and `RecommendationModal`.

---

## 📱 5. Interactive Component Specifications

### 1. `Header.tsx`
- **Branding**: Logo icon + `CampusSpace RoomRadar` title.
- **Live Clock Badge**: Clickable indicator showing live time in 12-hour format (`10:15 AM`) and day. Indicates whether system is running in **LIVE** or **CUSTOM** mode.
- **Wizard Trigger**: `Find Free Room` button opening recommendation modal.
- **Theme Switcher**: One-click Dark/Light mode toggle.

### 2. `ControlPanel.tsx`
- **Search Bar**: Real-time search by subject code (e.g., `CS201`), subject name, instructor name (e.g., `Dr. A. Sharma`), batch (`CSE-2A`), or room name (`Lab 201`).
- **Live vs Custom Mode Switch**: Radio buttons toggling between live clock evaluation and custom schedule browsing.
- **Day & Time Pickers**: Day dropdown (Monday–Saturday) and time input picker (`HH:MM`).
- **Building Selector**: Filter by specific campus block or "All Campus Buildings".
- **Floor Tabs**: Quick tabs for Ground Floor (`0`), `1F`, `2F`, `3F`, `4F`, or `All`.
- **Room Type Pills**: Filter pills for Classrooms, Computer Labs, Science Labs, and Seminar Halls.

### 3. `RoomCard.tsx`
- Displays room name, building name, floor level, seating capacity, desktop PC count, projector, AC, and power outlet icons.
- Shows real-time status:
  - If **FREE**: Green duration box showing end of free window and upcoming class reminder.
  - If **OCCUPIED**: Red class box displaying Subject Code, Subject Name, Instructor, Batch, and next free time.
- Action Buttons: `Weekly Schedule` (matrix modal) and `Room Specs` (drawer modal).

### 4. `RoomDetailDrawer.tsx`
- Slide-out side drawer providing full room specifications (seating capacity, PCs count, projection equipment, climate control, power outlets).
- Chronological timeline list of all schedule slots for the room on the selected day.

### 5. `WeeklyTimetableModal.tsx`
- Master Monday through Saturday interactive matrix table.
- Color-coded cells: Green = Free Slot, Red = Lecture Class, Indigo = Lab Session.

### 6. `RecommendationModal.tsx`
- Interactive wizard taking user purpose (Self Study, Group Discussion, Lab Work, Presentation), group size, building preference, and required equipment.
- Scores and returns top 3 recommended rooms with match rationale and free duration.

---

## 🚀 6. Performance & Build Metrics

- **Bundle Size**: ~242 kB JS / 21 kB CSS (gzipped: 73 kB / 4.3 kB).
- **Evaluation Latency**: Under 5ms for client-side evaluation of 100+ schedule slots.
- **Offline Fallback**: Automatic failover to local mock dataset if backend service is unreachable.
