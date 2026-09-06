# CampusSpace / RoomRadar — Execution Workflow

Here is a structured, end-to-end execution workflow for building the **CampusSpace / RoomRadar** application, integrating the frontend, backend, and core architectural components. 

### Phase 1: Architecture & Data Foundation
Before writing application logic, establish the underlying data structures and initial datasets.
* Define TypeScript interfaces and JSON schemas for `Room`, `Building`, `Amenities`, and `ScheduleSlot`.
* Generate mock datasets for campus buildings, rooms, and weekly master schedules to populate the timetable data engine.
* Draft the core availability algorithm, which calculates room status by converting 24-hour military time strings into total minutes past midnight.

### Phase 2: Backend API Development
Build the lightweight, high-performance Node.js and Express.js RESTful API service.
* Set up basic GET endpoints to retrieve data: `/api/buildings`, `/api/rooms`, and `/api/schedules`.
* Implement the core `/api/availability` endpoint that calculates real-time room status using the availability resolver logic.
* Develop the `/api/recommend` endpoint to power the smart room recommendation wizard, evaluating rooms based on required group size, equipment, and duration.
* Build the `/api/analytics` endpoint to return aggregate metrics like total free rooms and free computer labs.

### Phase 3: Frontend Core UI & State Management
Initialize the client-side application and build out the main interface using React 19, TypeScript, and Vite.
* Set up global state management using custom hooks like `useLiveTime` (for the ticking real-time clock) and `useTimetableEngine` (for filters and evaluation logic).
* Build the `ControlPanel` component to handle the Day/Time selector, Building/Floor dropdowns, and Room Type pills.
* Create the `RoomGrid` and `RoomCard` components to display rooms, using distinct visual accents like Emerald Green for available rooms and Rose Red for occupied rooms.
* Display ongoing session details (Subject Code, Instructor Name, Batch, and End Time) on occupied room cards.

### Phase 4: Advanced Features & Modal Integration
Enhance the user experience with detailed views and smart functionality.
* Develop the slide-out `RoomDetailDrawer` to display full room equipment specifications and a daily schedule timeline.
* Build the interactive `WeeklyTimetableModal`, featuring a Monday–Saturday matrix grid with color-coded slots (Green for Free, Red for Class, Indigo for Lab).
* Integrate the `RecommendationModal` wizard, allowing users to find optimal rooms with a single click based on their specific needs.
* Configure the frontend API service to seamlessly fail over to the offline mock dataset if the backend is unreachable.

### Phase 5: Polish, Testing & Deployment
Finalize the design system and optimize performance for a production-ready application.
* Apply the comprehensive Vanilla CSS design system, ensuring smooth micro-interactions, glassmorphism, and the Dark/Light mode toggle.
* Optimize client-side evaluation speed to ensure it takes under 5ms to process 500+ schedule slots.
* Ensure the UI is fluid and responsive across Mobile, Tablet, and Desktop screens using CSS Grid and Flexbox.
* Finalize the responsive layout and push the completed project repository to GitHub.
