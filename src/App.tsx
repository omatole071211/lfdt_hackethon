import { useEffect, useState } from 'react';
import { AnalyticsBanner } from './components/layout/AnalyticsBanner';
import { Header } from './components/layout/Header';
import { ControlPanel } from './components/filters/ControlPanel';
import { RoomGrid } from './components/rooms/RoomGrid';
import { RoomDetailDrawer } from './components/modals/RoomDetailDrawer';
import { WeeklyTimetableModal } from './components/modals/WeeklyTimetableModal';
import { RecommendationModal } from './components/modals/RecommendationModal';
import { OccupyRoomModal } from './components/modals/OccupyRoomModal';
import { useTimetableEngine } from './hooks/useTimetableEngine';
import type { RoomStatusResult } from './types';
import './index.css';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode theme class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Core Engine Hook
  const {
    buildings,
    schedules,
    filters,
    liveTime,
    activeDay,
    activeTime,
    filteredStatuses,
    statistics,
    toggleLiveMode,
    setSelectedDay,
    setSelectedTime,
    setSelectedBuilding,
    toggleFloorSelection,
    setSelectedType,
    setSearchQuery,
    setSortBy,
    // Dynamic Occupy System
    addReservation,
    removeReservation,
    occupyTarget,
    setOccupyTarget,
    // Drawer & Modals
    detailRoom,
    setDetailRoom,
    weeklyRoom,
    setWeeklyRoom,
    isRecommendOpen,
    setIsRecommendOpen,
  } = useTimetableEngine();

  // Find status result corresponding to drawer/modal selection
  const selectedDetailStatus: RoomStatusResult | null = detailRoom
    ? filteredStatuses.find((s) => s.room.id === detailRoom.id) || null
    : null;

  const selectedWeeklyStatus: RoomStatusResult | null = weeklyRoom
    ? filteredStatuses.find((s) => s.room.id === weeklyRoom.id) || null
    : null;

  return (
    <div className="app-wrapper">
      {/* Header Bar */}
      <Header
        liveTime={liveTime}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        isLiveMode={filters.isLiveMode}
        onResetLive={() => toggleLiveMode(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Quick Analytics Summary */}
        <AnalyticsBanner statistics={statistics} />

        {/* Control Bar Filters */}
        <ControlPanel
          buildings={buildings}
          filters={filters}
          onToggleLiveMode={toggleLiveMode}
          onSelectDay={setSelectedDay}
          onSelectTime={setSelectedTime}
          onSelectBuilding={setSelectedBuilding}
          onToggleFloor={toggleFloorSelection}
          onSelectType={setSelectedType}
          onSearchChange={setSearchQuery}
          onSelectSortBy={setSortBy}
        />

        {/* Available vs Occupied Room Grid */}
        <RoomGrid
          statuses={filteredStatuses}
          onOpenDetail={(res) => setDetailRoom(res.room)}
          onOpenWeekly={(res) => setWeeklyRoom(res.room)}
          onOccupyRoom={(res) => setOccupyTarget(res)}
          onVacateRoom={(res) => removeReservation(res.id)}
        />
      </main>

      {/* Faculty Occupy Room Modal */}
      {occupyTarget && (
        <OccupyRoomModal
          statusResult={occupyTarget}
          activeDay={activeDay}
          activeTime={activeTime}
          onClose={() => setOccupyTarget(null)}
          onOccupy={(res) => addReservation(res)}
        />
      )}

      {/* Slide-out Room Detail Drawer */}
      {detailRoom && (
        <RoomDetailDrawer
          statusResult={selectedDetailStatus}
          schedules={schedules}
          activeDay={activeDay}
          onClose={() => setDetailRoom(null)}
          onOpenWeekly={(res) => {
            setDetailRoom(null);
            setWeeklyRoom(res.room);
          }}
          onOccupyRoom={(res) => {
            setDetailRoom(null);
            setOccupyTarget(res);
          }}
          onVacateRoom={(res) => {
            removeReservation(res.id);
            setDetailRoom(null);
          }}
        />
      )}

      {/* Master Weekly Timetable Modal */}
      {weeklyRoom && (
        <WeeklyTimetableModal
          statusResult={selectedWeeklyStatus}
          schedules={schedules}
          onClose={() => setWeeklyRoom(null)}
        />
      )}

      {/* Smart Recommendation Wizard Modal */}
      {isRecommendOpen && (
        <RecommendationModal
          rooms={filteredStatuses.map((s) => s.room)}
          buildings={buildings}
          schedules={schedules}
          activeDay={activeDay}
          activeTime={activeTime}
          onClose={() => setIsRecommendOpen(false)}
          onSelectRoom={(res) => {
            setIsRecommendOpen(false);
            setDetailRoom(res.room);
          }}
        />
      )}

      {/* App Footer */}
      <footer className="app-footer">
        <p>
          <strong>CampusSpace</strong> — Real-time campus space finder
        </p>
      </footer>
    </div>
  );
}

export default App;
