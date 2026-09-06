import React, { useState } from 'react';
import { CheckCircle2, SearchX, SlidersHorizontal, XCircle } from 'lucide-react';
import type { RoomStatusResult } from '../../types';
import { RoomCard } from './RoomCard';

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
  const occupiedCount = statuses.length - availableCount;

  const displayedStatuses = statuses.filter((s) => {
    if (activeTab === 'available') return s.isAvailable;
    if (activeTab === 'occupied') return !s.isAvailable;
    return true;
  });

  return (
    <section className="room-grid-section">
      {/* Grid Filter Bar Tabs */}
      <div className="grid-header-tabs">
        <div className="tabs-left">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <SlidersHorizontal size={16} />
            <span>All Monitored ({statuses.length})</span>
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
          <p>Try adjusting your search query, building block, or floor filter settings.</p>
        </div>
      )}
    </section>
  );
};
