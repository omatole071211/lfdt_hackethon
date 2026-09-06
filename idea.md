# 🏫 Classroom & Lab Availability Finder — Project Ideation & Specification (`idea.md`)

## 📌 Executive Summary
**Project Name:** CampusSpace / RoomRadar — Classroom & Lab Availability Finder  
**Problem Statement:** Students and faculty often struggle to find available classrooms or labs in real-time because room availability varies continuously based on complex academic timetables. Finding empty spaces for self-study, group discussions, extra classes, or lab sessions leads to wasted time and unnecessary movement across campus floors.  
**Solution:** A timetable-driven web application that dynamically queries class schedules to reveal real-time and scheduled room availability across campus buildings, floors, and room types.

---

## 🎯 Core Requirements (Mandatory Implementation)

### 1. 📅 Day & Time Selector
- **Live Mode:** Quick toggle to check current availability based on system clock (`Now`).
- **Custom Schedule Picker:** Select any Day of the Week (Monday–Saturday) and specific Time Slot / Hour slider.
- **Time Slot Granularity:** Standard period slots (e.g., 9:00 AM–10:00 AM, 10:00 AM–11:00 AM, etc.) or custom time range picker.

### 2. 🏢 Building & Floor Selection
- **Multi-Building Filter:** Filter by campus blocks (e.g., Main Academic Building, Engineering Block, Science Complex).
- **Floor-Wise View:** Filter by Ground Floor, 1st Floor, 2nd Floor, etc., or select "All Floors".

### 3. 🟢 Available Rooms Display
- Visual grid or list of currently unoccupied rooms.
- Status indicator: **FREE** badge with duration (e.g., "Available for the next 2 hours").
- Quick filter by Room Type (Classroom vs. Lab).

### 4. 🔴 Occupied Rooms Display
- Distinct section or visual toggle for currently occupied rooms.
- Status indicator: **OCCUPIED** badge with current ongoing session.

### 5. 🏷️ Room Type Classification
- Explicit visual badges & icons distinguishing:
  - 📖 **Classroom / Lecture Hall**
  - 💻 **Computer Lab**
  - 🔬 **Science / Electronics / Mechanical Lab**
  - 🎭 **Seminar Hall / Auditorium**

### 6. 📝 Scheduled Class Details (For Occupied Rooms)
- Displays current active class information:
  - **Subject Name & Code** (e.g., *CS201 - Data Structures*)
  - **Faculty / Instructor** (e.g., *Dr. A. Sharma*)
  - **Batch / Section** (e.g., *CSE 2nd Year - Sec A*)
  - **Time Duration** (e.g., *10:00 AM – 12:00 PM*)

---

## 💡 Nice Additions (Value-Added Features)

### 1. ⏳ Next Available Time Slot
- For occupied rooms, displays exactly when the room will become free (e.g., *"Free in 45 mins at 11:00 AM"*).
- Shows remaining free window after current session ends.

### 2. 🪑 Room Capacity & Facilities Details
- **Seating Capacity:** Maximum student seating (e.g., 60 Seats, 120 Seats).
- **Equipment & Amenities Badges:**
  - 🖥️ Desktop Computers count (for labs)
  - 📽️ HD Projector / Smart Board
  - ❄️ Air Conditioned
  - 🔌 Power Outlets per desk
  - 📶 High-speed Wi-Fi access point

### 3. 👨‍🏫 Subject & Faculty Search
- Search bar to look up where a specific faculty member is currently teaching or where a subject class is held.
- Quick link from search result to the respective room status.

### 4. 📅 Weekly Timetable View
- Modal / Slide-out drawer showing a complete Monday–Saturday master schedule grid for any selected room.
- Color-coded slots (Green = Free, Red = Class, Yellow = Lab Session).

### 5. 🤖 Smart Free-Room Recommendations
- One-click **"Find Me a Free Room Now"** wizard:
  - Select need: *Quiet Study*, *Group Discussion*, *Lab Experiment*, or *Extra Lecture*.
  - Select group size: *Single*, *Small Group (2–5)*, *Large Group (10+)*.
  - Generates top 3 recommended rooms closest to user's location with longest uninterrupted free slot.

---

## 🏗️ Technical Architecture & Data Model

### Data Schemas (TypeScript Interfaces)

```typescript
export type RoomType = 'classroom' | 'computer_lab' | 'science_lab' | 'seminar_hall';

export interface Amenity {
  hasProjector: boolean;
  hasAC: boolean;
  hasWhiteboard: boolean;
  computerCount?: number;
  seatingCapacity: number;
}

export interface Room {
  id: string;
  name: string; // e.g. "Lab 302" or "CR-101"
  buildingId: string;
  buildingName: string;
  floor: number;
  type: RoomType;
  amenities: Amenity;
}

export interface ScheduleSlot {
  id: string;
  roomId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  batch: string;
}

export interface RoomStatusResult {
  room: Room;
  isAvailable: boolean;
  currentSchedule?: ScheduleSlot;
  nextAvailableTime?: string;
  freeUntil?: string;
}
```

---

## 🎨 UI/UX Design System

- **Theme Palette:** Modern Dark / Light Mode with vibrant status accents:
  - Available: Emerald Green (`#10B981`)
  - Occupied: Rose Red (`#F43F5E`)
  - Lab Badge: Indigo (`#6366F1`)
  - Classroom Badge: Amber (`#F59E0B`)
- **Key Screens:**
  1. **Header & Quick Control Bar:** Day/Time picker, Building filter, Floor tabs, Search input.
  2. **Summary Analytics Banner:** Quick statistics (Total Rooms, Currently Free, Currently Occupied, Labs Free).
  3. **Main Grid Split View:** Filterable cards showing room status, capacity badges, and class details.
  4. **Room Detail Drawer:** Full schedule breakdown, next free slot timer, and facility list.
  5. **Weekly Schedule Modal:** Interactive timetable matrix.

---

## 🚀 Execution Roadmap

| Phase | Milestone | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | Schema & Timetable Data Engine | Mock dataset generation for rooms, buildings, and weekly schedules. Filtering logic by day & time. |
| **Phase 2** | Core UI & Live Status Dashboard | Building & floor filters, Available vs. Occupied room cards, Classroom vs. Lab visual distinction. |
| **Phase 3** | Scheduled Details & Occupied Info | Active class cards showing Subject, Faculty, Batch, and time duration. |
| **Phase 4** | Advanced Additions | Next available slot calculator, Weekly timetable modal, Capacity/Amenity badges, Smart Recommendations. |
| **Phase 5** | Polish & Testing | Responsive layout, dark/light mode UI, performance optimization, and GitHub push. |
