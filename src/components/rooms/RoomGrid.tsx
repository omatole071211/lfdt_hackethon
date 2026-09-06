import React, { useState } from 'react';
import { BookOpen, CheckCircle2, GraduationCap, Monitor, SearchX, SlidersHorizontal, XCircle } from 'lucide-react';
import type { RoomStatusResult } from '../../types';
import { RoomCard } from './RoomCard';
import { formatTime12h } from '../../utils/timeHelpers';

interface RoomGridProps {
  statuses: RoomStatusResult[];
  onOpenDetail: (roomStatus: RoomStatusResult) => void;
  onOpenWeekly: (roomStatus: RoomStatusResult) => void;
}

type TabView = 'all' | 'available' | 'occupied';

export const RoomGrid: React.FC<RoomGridProps> = ({
  statuses,
  onOpenDetail,
  onOpenWeekly,
}) => {
  const [activeTab, setActiveTab] = useState<TabView>('all');

  const availableCount = statuses.filter((s) => s.isAvailable).length;
  const occupiedStatuses = statuses.filter((s) => !s.isAvailable && s.currentSchedule);
  const occupiedCount = occupiedStatuses.length;

  const classroomCount = statuses.filter((s) => s.room.type === 'classroom').length;
  const labCount = statuses.filter((s) => s.room.type === 'computer_lab' || s.room.type === 'science_lab').length;

  const displayedStatuses = statuses.filter((s) => {
    if (activeTab === 'available') return s.isAvailable;
    if (activeTab === 'occupied') return !s.isAvailable;
    return true;
  });

  return (
    <section className="room-grid-section">
      {/* Grid Header Counter Summary */}
      <div className="grid-summary-counter">
        <div className="counter-chip">
          <GraduationCap size={15} />
          <span>Classrooms: <strong>{classroomCount}</strong></span>
        </div>
        <div className="counter-chip">
          <Monitor size={15} />
          <span>Labs: <strong>{labCount}</strong></span>
        </div>
        <div className="counter-chip highlight">
          <BookOpen size={15} />
          <span>Occupied Classes: <strong>{occupiedCount}</strong></span>
        </div>
      </div>

      {/* Grid Filter Bar Tabs */}
      <div className="grid-header-tabs">
        <div className="tabs-left">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <SlidersHorizontal size={16} />
            <span>All Spaces ({statuses.length})</span>
          </button>

          <button
            className={`tab-btn tab-green ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <CheckCircle2 size={16} />
            <span>Available ({availableCount})</span>
          </button>

          <button
            className={`tab-btn tab-red ${activeTab === 'occupied' ? 'active' : ''}`}
            onClick={() => setActiveTab('occupied')}
          >
            <XCircle size={16} />
            <span>Occupied ({occupiedCount})</span>
          </button>
        </div>
      </div>

      {/* Occupied Classes Summary Banner */}
      {occupiedCount > 0 && (
        <div className="occupied-classes-summary">
          <div className="summary-title">
            <XCircle size={16} className="text-red" />
            <span>Currently Occupied Classes ({occupiedCount}):</span>
          </div>
          <div className="occupied-chips-grid">
            {occupiedStatuses.map(({ room, currentSchedule }) => (
              <div key={room.id} className="occupied-class-chip">
                <span className="chip-code">{currentSchedule?.subjectCode}</span>
                <span className="chip-subject">{currentSchedule?.subjectName}</span>
                <span className="chip-room">• {room.name} ({room.departmentName || `Floor ${room.floor}`})</span>
                <span className="chip-time">⏰ {formatTime12h(currentSchedule?.startTime || '')} – {formatTime12h(currentSchedule?.endTime || '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      {displayedStatuses.length > 0 ? (
        <div className="room-grid">
          {displayedStatuses.map((statusResult) => (
            <RoomCard
              key={statusResult.room.id}
              statusResult={statusResult}
              onOpenDetail={onOpenDetail}
              onOpenWeekly={onOpenWeekly}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <SearchX size={48} className="empty-icon" />
          <h3>No matching rooms found</h3>
          <p>Try adjusting your search query, building block, or floor selection settings.</p>
        </div>
      )}
    </section>
  );
};

